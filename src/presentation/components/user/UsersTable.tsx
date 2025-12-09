import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Chip,
} from "@mui/material";
import type { User } from "@domain";

/**
 * Props para la tabla de usuarios.
 */
type UsersTableProps = {
  /** Lista de usuarios a mostrar. */
  users: User[];
  /** Usuario actualmente seleccionado (para resaltado). */
  selectedUser: User | null;
  /** Callback al seleccionar un usuario. */
  onSelectUser: (user: User) => void;
};

const roleMap: { [key: number]: { label: string; color: "primary" | "secondary" | "default" | "success" | "warning" | "error" } } = {
  0: { label: "Estudiante", color: "primary" },
  1: { label: "Profesor", color: "secondary" },
  2: { label: "Admin", color: "success" },
};

/**
 * Tabla para visualizar la lista de usuarios.
 * Muestra información clave y permite la selección de filas.
 */
export const UsersTable = ({
  users,
  selectedUser,
  onSelectUser,
}: UsersTableProps) => {
  const getFullName = (user: User) => {
    return [user.firstName, user.midName, user.fatherLastname, user.motherLastname]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              onClick={() => onSelectUser(user)}
              role="radio"
              aria-checked={selectedUser?.id === user.id}
              tabIndex={-1}
              selected={selectedUser?.id === user.id}
              sx={{ cursor: "pointer" }}
            >
              <TableCell padding="checkbox">
                <Radio
                  checked={selectedUser?.id === user.id}
                  onChange={() => onSelectUser(user)}
                  name="user-radio-button"
                />
              </TableCell>
              <TableCell component="th" scope="row">
                {getFullName(user)}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip label={roleMap[user.role]?.label || 'Desconocido'} color={roleMap[user.role]?.color || 'default'} size="small" />
              </TableCell>
              <TableCell>
                <Chip label={user.active ? 'Activo' : 'Inactivo'} color={user.active ? 'success' : 'error'} variant="outlined" size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
