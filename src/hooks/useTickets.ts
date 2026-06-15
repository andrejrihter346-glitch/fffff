import { useState, useEffect, useCallback } from 'react';
import { supabase, type Ticket, type TicketMessage } from '../lib/supabase';
import { useAuth } from './useAuth';

// Генерация ID тикета из 5 символов
function generateTicketCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Форматирование времени MSK
function formatTimeMSK(date: string | Date): string {
  return new Date(date).toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });
}

export type TicketPurpose = 'purchase' | 'support';
export type PaymentMethod = 'site' | 'funpay' | 'reseller';

export interface CreateTicketData {
  purpose: TicketPurpose;
  // Для покупки
  productName?: string;
  paymentMethod?: PaymentMethod;
  // Для поддержки
  description?: string;
}

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
      setTickets((data || []) as Ticket[]);
    }
    
    setLoading(false);
  }, [profile, isStaff]);

  useEffect(() => {
    if (profile) {
      fetchTickets();
    }
  }, [profile, fetchTickets]);

  const createTicket = async (data: CreateTicketData): Promise<Ticket | null> => {
    if (!profile) return null;

    const ticketCode = generateTicketCode();
    const title = data.purpose === 'purchase' 
      ? `Покупка: ${data.productName}`
      : `Поддержка: ${data.description?.slice(0, 50)}...`;

    // Создаём тикет
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        user_id: profile.id,
        title,
        ticket_code: ticketCode,
        purpose: data.purpose,
        product_name: data.productName || null,
        payment_method: data.paymentMethod || null,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return null;
    }

    // Системное сообщение о создании
    const purposeText = data.purpose === 'purchase' ? 'покупку' : 'поддержку';
    await supabase.from('ticket_messages').insert({
      ticket_id: ticket.id,
      user_id: profile.id,
      message: `создал тикет #${ticketCode} (${purposeText})`,
      is_system: true,
      system_type: 'created'
    });

    // Если покупка - добавляем карточку с деталями
    if (data.purpose === 'purchase') {
      const methodLabels: Record<string, string> = {
        site: 'На сайте',
        funpay: 'FunPay',
        reseller: 'Через реселлера'
      };
      await supabase.from('ticket_messages').insert({
        ticket_id: ticket.id,
        user_id: profile.id,
        message: JSON.stringify({
          type: 'purchase_request',
          productName: data.productName,
          paymentMethod: methodLabels[data.paymentMethod || 'site']
        }),
        is_system: true,
        system_type: 'purchase_card'
      });
    }

    // Если поддержка - добавляем описание
    if (data.purpose === 'support' && data.description) {
      await supabase.from('ticket_messages').insert({
        ticket_id: ticket.id,
        user_id: profile.id,
        message: data.description,
        is_system: false
      });
    }

    await fetchTickets();
    return ticket;
  };

  const joinTicket = async (ticketId: string) => {
    if (!profile || !isStaff) return false;

    const { error } = await supabase
      .from('tickets')
      .update({ 
        assigned_to: profile.id,
        status: 'in_progress'
      })
      .eq('id', ticketId);

    if (error) {
      console.error('Error joining ticket:', error);
      return false;
    }

    // Системное сообщение
    await supabase.from('ticket_messages').insert({
      ticket_id: ticketId,
      user_id: profile.id,
      message: `присоединился к тикету`,
      is_system: true,
      system_type: 'joined'
    });

    await fetchTickets();
    return true;
  };

  const closeTicket = async (ticketId: string, reason: string) => {
    if (!profile || !isStaff) return false;

    const { error } = await supabase
      .from('tickets')
      .update({ status: 'closed' })
      .eq('id', ticketId);

    if (error) return false;

    await supabase.from('ticket_messages').insert({
      ticket_id: ticketId,
      user_id: profile.id,
      message: `закрыл тикет. Причина: ${reason}`,
      is_system: true,
      system_type: 'closed'
    });

    await fetchTickets();
    return true;
  };

  const reopenTicket = async (ticketId: string) => {
    if (!profile || !isStaff) return false;

    const { error } = await supabase
      .from('tickets')
      .update({ status: 'in_progress' })
      .eq('id', ticketId);

    if (error) return false;

    await supabase.from('ticket_messages').insert({
      ticket_id: ticketId,
      user_id: profile.id,
      message: `открыл тикет повторно`,
      is_system: true,
      system_type: 'reopened'
    });

    await fetchTickets();
    return true;
  };

  return {
    tickets,
    loading,
    createTicket,
    joinTicket,
    closeTicket,
    reopenTicket,
    refreshTickets: fetchTickets
  };
}

export function useTicketMessages(ticketId: string | null) {
  const { profile, isStaff } = useAuth();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!ticketId) return;

    const { data, error } = await supabase
      .from('ticket_messages')
      .select(`*, profiles(*)`)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages((data || []) as TicketMessage[]);
    }
    
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    fetchMessages();

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
          () => fetchMessages()
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

  const sendPaymentCard = async (productName: string, amount: number, paymentMethod: PaymentMethod, paymentLink?: string) => {
    if (!ticketId || !profile || !isStaff) return false;

    await supabase
      .from('tickets')
      .update({ status: 'payment' })
      .eq('id', ticketId);

    const methodLabels: Record<string, string> = {
      site: 'На сайте',
      funpay: 'FunPay',
      reseller: 'Через реселлера'
    };

    const { error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        user_id: profile.id,
        message: JSON.stringify({
          type: 'payment_card',
          productName,
          amount,
          paymentMethod: methodLabels[paymentMethod],
          paymentLink
        }),
        is_system: true,
        system_type: 'payment',
        payment_amount: amount,
        payment_link: paymentLink,
        payment_status: 'pending'
      });

    if (error) {
      console.error('Error sending payment:', error);
      return false;
    }

    return true;
  };

  const confirmPayment = async (messageId: string) => {
    if (!profile || !isStaff) return false;

    const { error } = await supabase
      .from('ticket_messages')
      .update({ payment_status: 'paid' })
      .eq('id', messageId);

    if (error) return false;
    await fetchMessages();
    return true;
  };

  return {
    messages,
    loading,
    sendMessage,
    sendPaymentCard,
    confirmPayment,
    refreshMessages: fetchMessages,
    formatTimeMSK
  };
}
