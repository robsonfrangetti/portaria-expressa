import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '../services/api'
import { DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

interface Report {
  id: string
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  period: string
  fileName?: string
  fileUrl?: string
  createdAt: string
}

export default function Reports() {
  const [reportType, setReportType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY')
  const [reportPeriod, setReportPeriod] = useState('')
  const queryClient = useQueryClient()

  const { data: response, isLoading } = useQuery(
    'reports',
    () => api.get('/reports').then(res => res.data)
  )

  const generateMutation = useMutation(
    (data: { type: string; period: string; format: string }) =>
      api.post('/reports/generate', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reports')
        toast.success('Relatório gerado com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao gerar relatório')
      }
    }
  )

  const reports = response?.data || []

  const handleGenerateReport = () => {
    if (!reportPeriod) {
      toast.error('Selecione um período')
      return
    }

    generateMutation.mutate({
      type: reportType,
      period: reportPeriod,
      format: 'JSON'
    })
  }

  const getPeriodInput = () => {
    switch (reportType) {
      case 'DAILY':
        return (
          <input
            type="date"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="input"
          />
        )
      case 'WEEKLY':
        return (
          <input
            type="week"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="input"
          />
        )
      case 'MONTHLY':
        return (
          <input
            type="month"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="input"
          />
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Gere relatórios de entrada e saída</p>
      </div>

      {/* Generate Report */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Gerar Novo Relatório</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="input"
              >
                <option value="DAILY">Diário</option>
                <option value="WEEKLY">Quinzenal</option>
                <option value="MONTHLY">Mensal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              {getPeriodInput()}
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={generateMutation.isLoading || !reportPeriod}
                className="btn-primary w-full"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                {generateMutation.isLoading ? 'Gerando...' : 'Gerar Relatório'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Relatórios Gerados</h3>
        </div>
        <div className="card-body p-0">
          {reports.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gerado em
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report: Report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.type === 'DAILY' && 'Diário'}
                          {report.type === 'WEEKLY' && 'Quinzenal'}
                          {report.type === 'MONTHLY' && 'Mensal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {report.fileUrl && (
                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              // TODO: Implement view report functionality
                              toast('Funcionalidade será implementada')
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Visualizar
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
              <p className="text-gray-500">Nenhum relatório gerado ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
