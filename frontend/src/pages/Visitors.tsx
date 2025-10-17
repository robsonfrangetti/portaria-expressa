import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '../services/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

interface Visitor {
  id: string
  name: string
  document?: string
  phone?: string
  email?: string
  company?: string
  photo?: string
  createdAt: string
}

export default function Visitors() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
  const queryClient = useQueryClient()

  const { data: response, isLoading } = useQuery(
    ['visitors', searchTerm],
    () => api.get(`/visitors?search=${searchTerm}`).then(res => res.data)
  )

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/visitors/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('visitors')
        toast.success('Visitante removido com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao remover visitante')
      }
    }
  )

  const visitors = response?.data || []

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitantes</h1>
          <p className="text-gray-600">Gerencie os visitantes cadastrados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Visitante
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Buscar visitantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Visitors List */}
      <div className="card">
        <div className="card-body p-0">
          {visitors.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastrado em
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitors.map((visitor: Visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {visitor.photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={visitor.photo}
                                alt={visitor.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-600">
                                  {visitor.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {visitor.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visitor.document || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {visitor.company || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {visitor.phone && (
                            <div>{visitor.phone}</div>
                          )}
                          {visitor.email && (
                            <div className="text-gray-500">{visitor.email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(visitor.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingVisitor(visitor)
                              setShowModal(true)
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja remover este visitante?')) {
                                deleteMutation.mutate(visitor.id)
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum visitante encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* TODO: Add Visitor Modal Component */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingVisitor ? 'Editar Visitante' : 'Novo Visitante'}
            </h3>
            <p className="text-gray-600">
              Modal de cadastro/edição será implementado aqui
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingVisitor(null)
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
