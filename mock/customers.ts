/**
 * Endpoints simulados de clientes (`/customers`), com os dados em memória:
 * reiniciar o `pnpm dev` volta à lista inicial. Seguem o contrato de
 * `src/modules/customers/types.ts` e respondem erros em RFC 9457.
 */
import { problem, type MockHandler, type MockResponse } from './api-mock.ts';

interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  createdAt: string;
}

type CustomerFields = Omit<CustomerRecord, 'id' | 'createdAt'>;

const FIRST_NAMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabriela', 'Heitor'];
const LAST_NAMES = ['Souza', 'Lima', 'Pereira', 'Costa'];

/** 32 clientes determinísticos: dá para paginar já na primeira tela. */
export function createSeed(): CustomerRecord[] {
  return LAST_NAMES.flatMap((lastName, lastIndex) =>
    FIRST_NAMES.map((firstName, firstIndex) => {
      const id = lastIndex * FIRST_NAMES.length + firstIndex + 1;
      const slug = `${firstName}.${lastName}`.normalize('NFD').replace(/[^\w.]/g, '');
      const digits = String(8000_0000 + id * 137);
      return {
        id,
        name: `${firstName} ${lastName}`,
        email: `${slug.toLowerCase()}@example.com`,
        phone: id % 3 === 0 ? null : `(31) 9${digits.slice(0, 4)}-${digits.slice(4)}`,
        active: id % 5 !== 0,
        createdAt: new Date(Date.UTC(2026, 0, id, 12)).toISOString(),
      };
    })
  );
}

/** Valida o corpo de POST/PUT; devolve os campos limpos ou um erro 400. */
function parseFields(body: unknown): CustomerFields | MockResponse {
  const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!name || !email) {
    return problem(400, 'Bad Request', 'Nome e e-mail são obrigatórios.');
  }
  const phone = typeof data.phone === 'string' && data.phone.trim() ? data.phone.trim() : null;
  return { name, email, phone, active: data.active !== false };
}

const isResponse = (value: CustomerFields | MockResponse): value is MockResponse =>
  'status' in value;

function positiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Handlers do CRUD de clientes. Cada chamada cria uma base própria em memória
 * (os testes começam sempre da mesma lista).
 */
export function createCustomerHandlers(seed: CustomerRecord[] = createSeed()): MockHandler[] {
  const customers = [...seed];
  let nextId = Math.max(0, ...customers.map(({ id }) => id)) + 1;

  const findIndex = (id: string) => customers.findIndex((customer) => String(customer.id) === id);
  const notFound = () => problem(404, 'Not Found', 'Cliente não encontrado.');
  const emailTaken = (email: string, exceptId?: number) =>
    customers.some(
      (customer) => customer.id !== exceptId && customer.email.toLowerCase() === email.toLowerCase()
    );
  const conflict = () => problem(409, 'Conflict', 'Já existe um cliente com este e-mail.');

  return [
    {
      method: 'GET',
      path: '/customers',
      handle: ({ query }) => {
        const page = positiveInt(query.get('page'), 1);
        const pageSize = positiveInt(query.get('pageSize'), 10);
        const search = (query.get('search') ?? '').trim().toLowerCase();
        const filtered = search
          ? customers.filter(({ name, email }) => `${name} ${email}`.toLowerCase().includes(search))
          : customers;
        const start = (page - 1) * pageSize;
        return {
          status: 200,
          body: {
            items: filtered.slice(start, start + pageSize),
            total: filtered.length,
            page,
            pageSize,
          },
        };
      },
    },
    {
      method: 'GET',
      path: '/customers/:id',
      handle: ({ params }) => {
        const customer = customers[findIndex(params.id ?? '')];
        return customer ? { status: 200, body: customer } : notFound();
      },
    },
    {
      method: 'POST',
      path: '/customers',
      handle: ({ body }) => {
        const fields = parseFields(body);
        if (isResponse(fields)) return fields;
        if (emailTaken(fields.email)) return conflict();

        const customer = { id: nextId++, ...fields, createdAt: new Date().toISOString() };
        customers.unshift(customer);
        return { status: 201, body: customer };
      },
    },
    {
      method: 'PUT',
      path: '/customers/:id',
      handle: ({ params, body }) => {
        const index = findIndex(params.id ?? '');
        const current = customers[index];
        if (!current) return notFound();

        const fields = parseFields(body);
        if (isResponse(fields)) return fields;
        if (emailTaken(fields.email, current.id)) return conflict();

        const customer = { ...current, ...fields };
        customers[index] = customer;
        return { status: 200, body: customer };
      },
    },
    {
      method: 'DELETE',
      path: '/customers/:id',
      handle: ({ params }) => {
        const index = findIndex(params.id ?? '');
        if (index === -1) return notFound();

        customers.splice(index, 1);
        return { status: 204 };
      },
    },
  ];
}
