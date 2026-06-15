-- Добавляем новые поля в таблицы
-- Выполни в Supabase → SQL Editor

-- Добавляем поля в tickets
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS ticket_code TEXT;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS purpose TEXT DEFAULT 'support';
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Добавляем поле system_type в messages
ALTER TABLE public.ticket_messages ADD COLUMN IF NOT EXISTS system_type TEXT;

-- Индекс для быстрого поиска по коду тикета
CREATE INDEX IF NOT EXISTS idx_tickets_code ON public.tickets(ticket_code);
