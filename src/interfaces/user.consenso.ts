export interface UserConsenso {
  id: string;
  in_response_to: string;
  name_id: string;
  session_index: string;
  email: string;
  given_name: string;
  surname: string;
  cedula: string;
  estado: boolean;
  companyId: number | null;
}
