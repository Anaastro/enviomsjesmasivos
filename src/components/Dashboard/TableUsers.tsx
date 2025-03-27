import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Spinner,
} from "@nextui-org/react";
import UserService from "@/services/userService";
import Modal from "../Modal";
import FormUser from "../FormUser";

export interface User {
  id?: string;
  lastLogin: string;
  phone: string;
  email: string;
  sessionActive: boolean;
  instanceId?: string;
  isSending?: boolean;
  rol?: string;
}

export default function TableUsers() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const rowsPerPage = 12;
  const loadingState = isLoading || users?.length === 0 ? "loading" : "idle";
  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { data }: any = await UserService.fetchPaginatedUsers();
      setUsers(data);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateList = (user: User) => {
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}

      <Table
        aria-label="Table with Codes"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[70vh]",
        }}
        className="w-full"
      >
        <TableHeader>
          <TableColumn key="email">EMAIL</TableColumn>
          <TableColumn key="instanceId">INSTANCE ID</TableColumn>
          <TableColumn key="rol">ROL</TableColumn>
          <TableColumn key="actions">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          emptyContent={"No hay usuarios existentes."}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.instanceId}</TableCell>
              <TableCell>{item.rol}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  color="warning"
                  onPress={() => handleEditClick(item)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <FormUser
            user={selectedUser}
            updateList={handleUpdateList}
            onCloseModal={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
