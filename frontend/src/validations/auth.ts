import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[a-z]/, 'Senha deve conter ao menos 1 letra minúscula')
  .regex(/[A-Z]/, 'Senha deve conter ao menos 1 letra maiúscula')
  .regex(/\d/, 'Senha deve conter ao menos 1 número')

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().optional(),
  bio: z.string().max(200, 'Bio deve ter no máximo 200 caracteres').optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export const eventSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  category: z.enum([
    'FESTA', 'OPEN_BAR', 'SHOW', 'ATLETICA', 'JOGOS_UNIVERSITARIOS',
    'RECEPCAO', 'WORKSHOP', 'PALESTRA', 'FEIRA_ACADEMICA', 'CULTURAL',
    'ESPORTIVO', 'ACADEMICO',
  ]),
  bannerUrl: z.string().url('URL do banner inválida'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  endTime: z.string().optional(),
  location: z.string().min(3, 'Local é obrigatório'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'UF deve ter 2 letras'),
  capacity: z.number({ error: 'Capacidade é obrigatória' }).min(1, 'Capacidade mínima é 1'),
  faculdadeIds: z.array(z.string()).min(1, 'Selecione ao menos uma faculdade'),
  atleticaIds: z.array(z.string()),
  rulesText: z.string().optional(),
  lots: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Nome do lote é obrigatório'),
        price: z.number({ error: 'Preço inválido' }).min(0),
        quantity: z.number({ error: 'Quantidade inválida' }).min(1),
      }),
    )
    .min(1, 'Adicione ao menos um lote'),
  scheduleItems: z.array(
    z.object({
      time: z.string().min(1, 'Horário obrigatório'),
      title: z.string().min(1, 'Título obrigatório'),
      description: z.string().optional(),
    }),
  ),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type EventFormData = z.infer<typeof eventSchema>
