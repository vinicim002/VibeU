import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
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
  category: z.enum(['FESTA', 'SHOW', 'ESPORTIVO', 'ACADEMICO', 'RECEPCAO']),
  bannerUrl: z.string().url('URL do banner inválida'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  endTime: z.string().optional(),
  location: z.string().min(3, 'Local é obrigatório'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  capacity: z.number({ error: 'Capacidade é obrigatória' }).min(1, 'Capacidade mínima é 1'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type EventFormData = z.infer<typeof eventSchema>
