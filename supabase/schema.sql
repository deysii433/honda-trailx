create extension if not exists "pgcrypto";

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null check (categoria in ('cuatrimoto', 'moto', 'pioneer')),
  precio integer not null,
  imagen text not null,
  imagenes text[] not null default '{}',
  color text not null,
  traccion text not null,
  motor text not null,
  año text not null,
  combustible text not null,
  descripcion text not null,
  ficha_tecnica jsonb,
  disponible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.apartados (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  producto_id uuid references public.productos(id) on delete set null,
  nombre_producto text not null,
  fecha timestamptz not null default now(),
  monto_apartado numeric(12,2) not null,
  estado_pedido text not null default 'pendiente' check (estado_pedido in ('pendiente', 'confirmado', 'cancelado', 'liquidado')),
  tipo_compra text not null default 'apartar' check (tipo_compra in ('apartar', 'comprar')),
  metodo_pago text,
  metodo_contacto text,
  mensaje text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_info (
  id uuid primary key default gen_random_uuid(),
  clave text not null unique,
  valor jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists productos_set_updated_at on public.productos;
create trigger productos_set_updated_at
before update on public.productos
for each row execute procedure public.set_updated_at();

drop trigger if exists clientes_set_updated_at on public.clientes;
create trigger clientes_set_updated_at
before update on public.clientes
for each row execute procedure public.set_updated_at();

drop trigger if exists admin_info_set_updated_at on public.admin_info;
create trigger admin_info_set_updated_at
before update on public.admin_info
for each row execute procedure public.set_updated_at();

insert into public.admin_info (clave, valor)
values
  ('negocio', jsonb_build_object('nombre', 'Honda Cuatrimotos México', 'telefono', '+52 777 457 4497', 'email', 'ventas@hondacuatrimotos.mx'))
on conflict (clave) do nothing;