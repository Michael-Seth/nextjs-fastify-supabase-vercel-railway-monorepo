"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search } from "@/components/ui/Search";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/formatters";
import { toast } from "sonner";
import type { User, PaginatedResult } from "@/types/api";

const roleVariant = { admin:"destructive" as const, user:"secondary" as const, moderator:"warning" as const };

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const { page, limit, setPage } = usePagination();
  const dSearch = useDebounce(search);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin","users",page,limit,dSearch],
    queryFn: () => api.get<PaginatedResult<User>>(`/users?page=${page}&limit=${limit}${dSearch?`&search=${dSearch}`:""}`).then(r=>r.data),
  });

  const { mutate: deleteUserMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id:string) => api.delete(`/users/${id}`),
    onSuccess: () => { toast.success("User deleted"); qc.invalidateQueries({queryKey:["admin","users"]}); setDeleteUser(null); },
    onError: (e:Error) => toast.error(e.message),
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Users</h1></div>
          <Search placeholder="Search users…" onSearch={setSearch} className="max-w-sm" />
          {isLoading ? <SkeletonTable rows={6} cols={5} /> : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {data?.data.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name ?? "—"}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Badge variant={roleVariant[u.role]}>{u.role}</Badge></TableCell>
                      <TableCell><Badge variant={u.is_active?"success":"secondary"}>{u.is_active?"Active":"Inactive"}</Badge></TableCell>
                      <TableCell>{formatDate(u.created_at)}</TableCell>
                      <TableCell><Button variant="destructive" size="sm" onClick={()=>setDeleteUser(u)}>Delete</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {data && <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
        </div>
        <Modal open={!!deleteUser} onClose={()=>setDeleteUser(null)} title="Delete user?" description={`Delete ${deleteUser?.email}? This cannot be undone.`}
          footer={<><Button variant="outline" onClick={()=>setDeleteUser(null)}>Cancel</Button><Button variant="destructive" loading={isDeleting} onClick={()=>deleteUser&&deleteUserMutation(deleteUser.id)}>Delete</Button></>}>
          <p className="text-muted-foreground text-sm">All data for this user will be permanently removed.</p>
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
