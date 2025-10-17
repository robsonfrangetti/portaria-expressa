import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export interface User {
  id: string
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR'
  companyId: string
  company?: {
    id: string
    name: string
    cnpj: string
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  cnpj: string
  companyName: string
  phone?: string
  address?: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem('token'),
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const response = await api.post('/auth/login', { email, password })
          
          if (response.data.success) {
            const { token, user } = response.data
            
            localStorage.setItem('token', token)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            set({ user, token, isLoading: false })
            toast.success('Login realizado com sucesso!')
          } else {
            throw new Error(response.data.error || 'Erro no login')
          }
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Erro no login'
          toast.error(message)
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true })
          
          const response = await api.post('/auth/register', data)
          
          if (response.data.success) {
            const { token, user } = response.data
            
            localStorage.setItem('token', token)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            set({ user, token, isLoading: false })
            toast.success('Cadastro realizado com sucesso!')
          } else {
            throw new Error(response.data.error || 'Erro no cadastro')
          }
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data?.error || 'Erro no cadastro'
          toast.error(message)
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null })
        toast.success('Logout realizado com sucesso!')
      },

      updateUser: (user: User) => {
        set({ user })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
)

// Initialize API token if exists
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
