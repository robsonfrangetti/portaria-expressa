import React from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '../services/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const companySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type CompanyForm = z.infer<typeof companySchema>

export default function Settings() {
  const queryClient = useQueryClient()

  const { data: company, isLoading } = useQuery(
    'company',
    () => api.get('/companies/me').then(res => res.data.company)
  )

  const updateMutation = useMutation(
    (data: CompanyForm) => api.put('/companies/me', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('company')
        toast.success('Empresa atualizada com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao atualizar empresa')
      }
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
  })

  const onSubmit = (data: CompanyForm) => {
    updateMutation.mutate(data)
  }

  // Reset form when company data loads
  React.useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        phone: company.phone || '',
        address: company.address || '',
      })
    }
  }, [company, reset])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações da sua empresa</p>
      </div>

      {/* Company Info */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Informações da Empresa</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome da Empresa
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="mt-1 input"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  {...register('phone')}
                  type="text"
                  className="mt-1 input"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="mt-1 input"
                placeholder="Endereço completo da empresa"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className="btn-primary"
              >
                {updateMutation.isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Company Details (Read-only) */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Detalhes da Conta</h3>
        </div>
        <div className="card-body">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
              <dd className="mt-1 text-sm text-gray-900">{company?.cnpj}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{company?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Membro desde</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {company?.createdAt && new Date(company.createdAt).toLocaleDateString('pt-BR')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {company?.updatedAt && new Date(company.updatedAt).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Informações do Sistema</h3>
        </div>
        <div className="card-body">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Portaria Expressa v1.0.0
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Sistema de controle de portaria desenvolvido para gerenciar 
                    entrada e saída de visitantes em predios comerciais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
