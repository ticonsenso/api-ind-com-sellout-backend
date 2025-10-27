import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataSource } from "typeorm";
import { idp, sp } from "../config/saml";
import { CreateUserDto } from "../dtos/users.dto";
import { UserConsenso } from "../interfaces/user.consenso";
import { decodeToken, generateToken } from "../middleware/auth.middleware";
import { AuthService } from "../services/auth.service";
import { InitSessionLogsService } from "../services/init.session.logs.service";
import { UserService } from "../services/users.service";

export class AuthController {
  public userService: UserService;
  public initSessionLogsService: InitSessionLogsService;
  //private redirectUrl = 'http://82.165.47.88:5176';
  //private redirectUrl = "http://localhost:5173";
  private redirectUrl = "https://sellout.indurama.com";
  
  constructor(dataSource: DataSource) {
    this.userService = new UserService(dataSource);
    this.initSessionLogsService = new InitSessionLogsService(dataSource);
    this.initiateSamlLogin = this.initiateSamlLogin.bind(this);
    this.handleSamlCallback = this.handleSamlCallback.bind(this);
    this.getSAMLMetadata = this.getSAMLMetadata.bind(this);
    this.initiateSamlLogout = this.initiateSamlLogout.bind(this);
    this.handleSamlLogoutResponse = this.handleSamlLogoutResponse.bind(this);
  }

  /**
   * Inicia el proceso de autenticación SAML
   * @param req - Objeto Request de Express
   * @param res - Objeto Response de Express
   */
  async initiateSamlLogin(req: Request, res: Response) {
    sp.create_login_request_url(idp, {}, (err, login_url) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.redirect(login_url); // Redirige al IdP
    });
  }

  /**
   * Maneja la respuesta de SAML y genera un token JWT
   * @param req - Objeto Request de Express
   * @param res - Objeto Response de Express
   */
  async handleSamlCallback(req: Request, res: Response) {
    try {
      const saml_response = req.body.SAMLResponse;
      let createUserDto: CreateUserDto;
      sp.post_assert(
        idp,
        {
          request_body: { SAMLResponse: saml_response },
          require_session_index: false, // Permite que la aserción sea válida sin el atributo SessionIndex
        },
        async (err, response) => {
          if (err) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: err.message });
          }
          const responseJson = JSON.parse(JSON.stringify(response));
          const cedulaValue = Array.isArray(responseJson.user.attributes.Cedula)
            ? responseJson.user.attributes.Cedula[0]
            : responseJson.user.attributes.Cedula;
          const estadoValue = Array.isArray(responseJson.user.attributes.Estado)
            ? responseJson.user.attributes.Estado[0]
            : responseJson.user.attributes.Estado;

          const userConsenso: UserConsenso = {
            id: responseJson?.response_header?.id,
            in_response_to: responseJson?.response_header?.in_response_to,
            name_id: responseJson?.user?.name_id,
            session_index: responseJson?.user?.session_index ?? "",
            email: responseJson?.user?.email ?? "",
            given_name: responseJson?.user?.given_name ?? "",
            surname: responseJson?.user?.surname ?? "",
            cedula: cedulaValue,
            estado: estadoValue === "512" ? true : false,
            companyId: responseJson?.user?.companyId,
          };
          if (!userConsenso.estado) {
            res.redirect(this.redirectUrl);
            return;
          }
          const token = generateToken(userConsenso);

          createUserDto = {
            dni: userConsenso.cedula,
            name: userConsenso.given_name + " " + userConsenso.surname,
            email: userConsenso.email,
            phone: userConsenso.cedula,
            status: userConsenso.estado,
            companyId: userConsenso.companyId!,
          };
          await this.userService.createUserLogin(createUserDto);
          await this.initSessionLogsService.createLoginLog({
            email: userConsenso.email,
            sessionId: userConsenso.id,
            sessionIndex: userConsenso.session_index,
            inResponseTo: userConsenso.in_response_to,
          });
          const redirectUrl = `${this.redirectUrl}/dashboard?token=${token}`;
          console.log(redirectUrl);
          res.redirect(redirectUrl);
        }
      );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error al manejar la respuesta de SAML" });
    }
  }

  /**
   * Genera un token JWT para el usuario
   * @param req - Objeto Request de Express
   * @param res - Objeto Response de Express
   */
  async generateTokenDev(req: Request, res: Response) {
    try {
      // Datos de prueba para desarrollo
      const userConsenso: UserConsenso = {
        id: "test",
        in_response_to: "_38b97f63f415741e6d4e251321d74acfce347892c3",
        name_id: "ext_consenso_ucomisiones@consenso.com.ec",
        session_index: "_2f862432-9b2e-4b5d-ac4f-bc643ae8fa36",
        email: "ext_consenso_ucomisiones@consenso.com.ec",
        given_name: "Usuario",
        surname: "Comisiones",
        cedula: "Empresa Consenso",
        estado: true, // El valor 512 se traduce a true según la lógica existente
        companyId: null,
      };

      // Generar token JWT
      const token = generateToken(userConsenso);

      // Devolver el token generado
      return res.status(StatusCodes.OK).json({
        token,
        user: {
          name: userConsenso.given_name + " " + userConsenso.surname,
          email: userConsenso.email,
          companyId: userConsenso.companyId,
        },
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error al generar token de desarrollo" });
    }
  }

  /**
   * Obtiene la metadata de SAML
   * @param req - Objeto Request de Express
   * @param res - Objeto Response de Express
   */
  async getSAMLMetadata(req: Request, res: Response) {
    const baseURL = req.query.baseURL as string;
    if (!baseURL) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Base URL is required" });
    }
    const signedXML = await AuthService.generateSAMLMetadata(baseURL);
    res.type("application/xml");
    res.send(signedXML);
  }
  /**
   * Inicia el logout SAML
   * @param req - Objeto Request de Express
   * @param res - Objeto Response de Express
   */
  async initiateSamlLogout(req: Request, res: Response) {
    try {
      const name_id = req.query.token as string; // Obtener del token o sesión
      sp.create_logout_request_url(
        idp,
        { name_id },
        async (err, logout_url) => {
          try {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            const userConsenso = decodeToken(name_id);
            await this.initSessionLogsService.logout(userConsenso.name_id);
            res.redirect(logout_url); // Redirige al IdP para cerrar sesión
          } catch (error) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
  }
  /**
   * Maneja la respuesta de logout (opcional)
   * @param req - Objeto Request de Express
   * @param res - Objeto Response de Express
   */
  async handleSamlLogoutResponse(req: Request, res: Response) {
    const saml_response = req.body.SAMLResponse;
    sp.post_assert(
      idp,
      { request_body: { SAMLResponse: saml_response } },
      (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        //res.redirect("http://localhost:3000/"); // Redirige al frontend tras logout
        res.redirect("https://compensaciones.consensocorp.com"); // Redirige al frontend tras logout
      }
    );
  }
}
