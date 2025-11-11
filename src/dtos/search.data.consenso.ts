import {Expose} from "class-transformer";
import {IsInt, IsOptional, IsString,} from "class-validator";

export class SearchDataConsensoDto {
    @IsString({ message: "La empresa debe ser una cadena de texto." })
    @IsOptional()
    @Expose()
    empresa?: string;

    @IsInt({ message: "El año debe ser un número entero." })
    @Expose()
    anio?: number;

    @IsInt({ message: "El mes debe ser un número entero." })
    @Expose()
    mes?: number;
}


export class ResponseDataConsensoDto {
    @Expose()
    empresa?: string;
    @Expose()
    codigo_empleado?: number;
    @Expose()
    cedula_colaborador?: string;
    @Expose()
    cargo?: string;
    @Expose()
    anio_calculo?: number;
    @Expose()
    mes_calculo?: number;
    @Expose()
    sueldo_variable?: number;
    @Expose()
    porcentaje_cumplimiento?: number;
    @Expose()
    valor_comision_pagar?: number;
}
