import { useState } from 'react'
import { useQuery } from 'react-query'
import { api } from '../services/api'
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'

interface Entry {
  id: string
  type: 'ENTRY' | 'EXIT'
  timestamp: string
  notes?: string
  photo?: string
  temperature?: number
  visitor?: {
    id: string
    name: string
    document?: string
    company?: string
    photo?: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

export default function Entries() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showModal, setShowModal] = useState(false)

  const { data: response, isLoading } = useQuery(
    ['entries', selectedDate],
    () => api.get(`/entries?date=${selectedDate}`).then(res => res.data)
  )

  const entries = response?.data || []

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entradas e Saídas</h1>
          <p className="text-gray-600">Controle de acesso ao predio</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Entrada/Saída
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="card">
        <div className="card-body p-0">
          {entries.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temperatura
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry: Entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.type === 'ENTRY' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {entry.type === 'ENTRY' ? (
                              <ArrowUpIcon className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="ml-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entry.type === 'ENTRY' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {entry.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.visitor ? (
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              {entry.visitor.photo ? (
                                <img
                                  className="h-8 w-8 rounded-full object-cover"
                                  src={entry.visitor.photo}
                                  alt={entry.visitor.name}
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary-600">
                                    {entry.visitor.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {entry.visitor.name}
                              </div>
                              {entry.visitor.company && (
                                <div className="text-sm text-gray-500">
                                  {entry.visitor.company}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Visitante não identificado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {entry.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.temperature ? `${entry.temperature}°C` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma entrada/saída encontrada para esta data</p>
            </div>
          )}
        </div>
      </div>

      {/* TODO: Add Entry Modal Component */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nova Entrada/Saída
            </h3>
            <p className="text-gray-600">
              Modal de entrada/saída será implementado aqui
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
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
