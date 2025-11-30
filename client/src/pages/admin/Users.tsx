import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { Pencil, ArrowLeft } from 'lucide-react';

export function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editCredits, setEditCredits] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<'user' | 'admin' | null>(null);

  const { data, isLoading, refetch } = trpc.admin.getUsers.useQuery({
    page,
    limit: 20,
    search: search || undefined,
  });

  const updateUserMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso!');
      setEditingUser(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar usuário');
    },
  });

  const handleEdit = (userId: number, currentCredits: number, currentRole: 'user' | 'admin') => {
    setEditingUser(userId);
    setEditCredits(currentCredits);
    setEditRole(currentRole);
  };

  const handleSave = (userId: number) => {
    if (editCredits === null || editRole === null) return;

    updateUserMutation.mutate({
      userId,
      credits: editCredits,
      role: editRole,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  const users = data?.users || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Usuários</h1>
          <p className="text-gray-600">Gerenciar usuários do sistema</p>
        </div>
      </div>

      {/* Busca */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({pagination.total})</CardTitle>
          <CardDescription>
            Página {page} de {pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Créditos</th>
                  <th className="text-left p-2">Use Case</th>
                  <th className="text-left p-2">Nicho</th>
                  <th className="text-left p-2">Criado em</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.name || '-'}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      {editingUser === user.id ? (
                        <select
                          value={editRole || user.role}
                          onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
                          className="border rounded px-2 py-1"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {editingUser === user.id ? (
                        <Input
                          type="number"
                          value={editCredits ?? user.credits}
                          onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                      ) : (
                        user.credits
                      )}
                    </td>
                    <td className="p-2 text-sm text-gray-600 max-w-xs truncate">
                      {user.onboardingUseCase || '-'}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {user.onboardingNiche || '-'}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="p-2">
                      {editingUser === user.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(user.id)}
                            disabled={updateUserMutation.isPending}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user.id, user.credits, user.role)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="px-4 py-2">
                Página {page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

