import { useState, useEffect, useCallback } from 'react';
import { supabase, type Ticket, type TicketMessage } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTickets() {
  const { profile, isStaff } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (!profile) return;

    setLoading(true);
    
    let query = supabase
      .from('tickets')
      .select(`
        *,
        profiles!tickets_user_id_fkey(*),
        assigned_profile:profiles!tickets_assigned_to_fkey(*)
      `)
      .order('updated_at', { ascending: false });

    // Обычные пользователи видят только свои тикеты
    if (!isStaff) {
      query = query.eq('user_id', profile.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tickets:', error);
    } else {
      setTickets(data as Ticket[]);
    }
    
    setLoading(false);
  }, [profile, isStaff]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = async (title: string): Promise<Ticket | null> => {
    if (!profile) return null;

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        user_id: profile.id,
        title,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return null;
    }

    await fetchTickets();
    return data;
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket:', error);
      return false;
    }

    await fetchTickets();
    return true;
  };

  const assignTicket = async (ticketId: string, userId: string | null) => {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        assigned_to: userId,
        status: userId ? 'in_progress' : 'open'
      })
      .eq('id', ticketId);

    if (error) {
      console.error('Error assigning ticket:', error);
      return false;
    }

    await fetchTickets();
    return true;
  };

  return {
    tickets,
    loading,
    createTicket,
    updateTicketStatus,
    assignTicket,
    refreshTickets: fetchTickets
  };
}

export function useTicketMessages(ticketId: string | null) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!ticketId) return;

    const { data, error } = await supabase
      .from('ticket_messages')
      .select(`
        *,
        profiles(*)
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data as TicketMessage[]);
    }
    
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    fetchMessages();

    // Realtime подписка
    if (ticketId) {
      const channel = supabase
        .channel(`ticket-${ticketId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'ticket_messages',
            filter: `ticket_id=eq.${ticketId}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [ticketId, fetchMessages]);

  const sendMessage = async (message: string) => {
    if (!ticketId || !profile) return false;

    const { error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        user_id: profile.id,
        message
      });

    if (error) {
      console.error('Error sending message:', error);
      return false;
    }

    return true;
  };

  const sendPaymentRequest = async (amount: number, link: string) => {
    if (!ticketId || !profile) return false;

    // Обновляем статус тикета
    await supabase
      .from('tickets')
      .update({ status: 'payment' })
      .eq('id', ticketId);

    // Отправляем сообщение с оплатой
    const { error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        user_id: profile.id,
        message: `Ссылка на оплату`,
        is_system: true,
        payment_amount: amount,
        payment_link: link,
        payment_status: 'pending'
      });

    if (error) {
      console.error('Error sending payment:', error);
      return false;
    }

    return true;
  };

  const markPaymentPaid = async (messageId: string) => {
    const { error } = await supabase
      .from('ticket_messages')
      .update({ payment_status: 'paid' })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking paid:', error);
      return false;
    }

    await fetchMessages();
    return true;
  };

  return {
    messages,
    loading,
    sendMessage,
    sendPaymentRequest,
    markPaymentPaid,
    refreshMessages: fetchMessages
  };
}
