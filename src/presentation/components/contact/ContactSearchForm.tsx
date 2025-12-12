import { useState, type FormEvent } from "react";
import { Grid, TextField, Paper, Box, Button } from "@mui/material";
import {
  SearchType,
  type ContactCriteria,
  type StringQuery,
} from "@application";

type ContactSearchFormProps = {
  criteria: ContactCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<ContactCriteria>>;
};

/**
 * Helper para crear un objeto StringQuery tipo "LIKE".
 */
const createStringQuery = (value: string): StringQuery | undefined => {
  // "LIKE" es un valor estándar para búsquedas de tipo "contains" o "contiene".
  return value ? { text: value, searchType: SearchType.LIKE } : undefined;
};

/**
 * Formulario de búsqueda para contactos.
 * Permite filtrar por alias y por etiqueta.
 */
export const ContactSearchForm = ({
  criteria,
  setCriteria,
}: ContactSearchFormProps) => {
  const [alias, setAlias] = useState(criteria.alias?.text || "");
  const [tag, setTag] = useState(criteria.tags?.[0] || "");
  const [email, setEmail] = useState(criteria.email?.text || "");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCriteria((prev) => ({
      ...prev,
      page: 1,
      alias: createStringQuery(alias),
      tags: tag ? [tag] : undefined,
    }));
  };

  const handleClear = () => {
    setAlias("");
    setTag("");
    setEmail("");
    setCriteria((prev) => ({
      ...prev,
      page: 1,
      alias: undefined,
      tags: undefined,
    }));
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Buscar por alias"
              variant="outlined"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Buscar por etiqueta"
              variant="outlined"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Buscar por email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button type="submit" variant="contained" fullWidth>
                Buscar
              </Button>
              <Button variant="outlined" onClick={handleClear} fullWidth>
                Limpiar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
