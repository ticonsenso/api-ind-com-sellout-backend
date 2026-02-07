import { Expose, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductSicDto {

    @IsOptional()
    @IsString({ message: "El ID del producto SIC debe ser una cadena de texto" })
    idProductoSic?: string | null;

    @IsNotEmpty({ message: "El código JDE es requerido" })
    @IsString({ message: "El código JDE debe ser una cadena de texto" })
    codigoJde!: string;

    @IsOptional()
    @IsString({ message: "El número de repetidos debe ser una cadena de texto" })
    numRepetidos?: string | null;

    @IsNotEmpty({ message: "El nombre IME es requerido" })
    @IsString({ message: "El nombre IME debe ser una cadena de texto" })
    nombreIme!: string;

    @IsNotEmpty({ message: "El código SAP es requerido" })
    @IsString({ message: "El código SAP debe ser una cadena de texto" })
    codigoSap!: string;

    @IsNotEmpty({ message: "El nombre SAP es requerido" })
    @IsString({ message: "El nombre SAP debe ser una cadena de texto" })
    nombreSap!: string;

    @IsNotEmpty({ message: "La línea de negocio SAP es requerida" })
    @IsString({ message: "La línea de negocio SAP debe ser una cadena de texto" })
    lineaNegocioSap!: string;

    @IsNotEmpty({ message: "La descripción del grupo de artículo es requerida" })
    @IsString({ message: "La descripción del grupo de artículo debe ser una cadena de texto" })
    marDescGrupoArt!: string;

    @IsNotEmpty({ message: "La descripción de jerarquía es requerida" })
    @IsString({ message: "La descripción de jerarquía debe ser una cadena de texto" })
    marDescJerarq!: string;

    @IsNotEmpty({ message: "El modelo IM es requerido" })
    @IsString({ message: "El modelo IM debe ser una cadena de texto" })
    marModeloIm!: string;

    @IsNotEmpty({ message: "La línea de diseño SAP es requerida" })
    @IsString({ message: "La línea de diseño SAP debe ser una cadena de texto" })
    lineaDisenioSap!: string;

    @IsNotEmpty({ message: "La marca SAP es requerida" })
    @IsString({ message: "La marca SAP debe ser una cadena de texto" })
    marcaSap!: string;

    @IsOptional()
    @IsString({ message: "El color SAP debe ser una cadena de texto" })
    colorSap?: string | null;

    @IsOptional()
    @IsBoolean({ message: "El campo descontinuado debe ser un booleano" })
    descontinuado?: boolean;

    @IsOptional()
    @IsBoolean({ message: "El estado debe ser un booleano" })
    estado?: boolean;

    @IsNotEmpty({ message: "Hojas visita es requerido" })
    @IsString({ message: "Hojas visita debe ser una cadena de texto" })
    hojasVis!: string;

    @IsNotEmpty({ message: "PRO ID Equivalencia es requerido" })
    @IsString({ message: "PRO ID Equivalencia debe ser una cadena de texto" })
    proIdEquivalencia!: string;

    @IsNotEmpty({ message: "Equivalencia es requerida" })
    @IsString({ message: "Equivalencia debe ser una cadena de texto" })
    equivalencia!: string;

    @IsOptional()
    @IsString({ message: "Vigencia debe ser una cadena de texto" })
    vigencia?: string | null;
}

export class UpdateProductSicDto extends CreateProductSicDto { }

export class ProductSicResponseDto {
    @Expose()
    id!: number;

    @Expose()
    idProductoSic!: string | null;

    @Expose()
    codigoJde!: string;

    @Expose()
    numRepetidos!: string | null;

    @Expose()
    nombreIme!: string;

    @Expose()
    codigoSap!: string;

    @Expose()
    nombreSap!: string;

    @Expose()
    lineaNegocioSap!: string;

    @Expose()
    marDescGrupoArt!: string;

    @Expose()
    marDescJerarq!: string;

    @Expose()
    marModeloIm!: string;

    @Expose()
    lineaDisenioSap!: string;

    @Expose()
    marcaSap!: string;

    @Expose()
    colorSap!: string | null;

    @Expose()
    descontinuado!: boolean;

    @Expose()
    estado!: boolean;

    @Expose()
    hojasVis!: string;

    @Expose()
    proIdEquivalencia!: string;

    @Expose()
    equivalencia!: string;

    @Expose()
    vigencia!: string | null;
}

export class ProductSicResponsePptoDto {
    @Expose()
    lineaNegocioSap!: string;

    @Expose()
    marDescGrupoArt!: string;

    @Expose()
    marDescJerarq!: string;

    @Expose()
    marModeloIm!: string | null;

    @Expose()
    proIdEquivalencia!: string;

    @Expose()
    // TODO: Verify if we still need jdeName or if it maps to nombreIme or nombreSap.
    // Assuming nombreSap or nombreIme might be relevant, but keeping name generic if needed.
    // Based on previous code: jdeName.
    // User requested "codigo_jde" and "nombre_ime", "nombre_sap".
    // I will map to nombreIme for now as it seems most descriptive name, or maybe nombreSap.
    // Let's check original: jdeName was maintained. New schema has 'nombre_ime' and 'nombre_sap'.
    // I'll map to nombreSap as a safe bet for a name, or nombreIme.
    // The previous code had jdeName map to 'jde_name'.
    // I will expose 'nombreSap' here.
    nombreSap!: string;

    @Expose()
    marcaSap!: string;
}

export class StoreSearchDto {
    @IsOptional()
    @IsNumber({}, { message: "El ID debe ser un número" })
    id?: number;

    @IsOptional()
    @IsString({ message: "El código JDE debe ser una cadena de texto" })
    codigoJde?: string;

    @IsOptional()
    @IsString({ message: "El nombre SAP debe ser una cadena de texto" })
    nombreSap?: string;
}

export class ProductSicPaginatedResponseDto {
    @Expose()
    @Type(() => ProductSicResponseDto)
    items!: ProductSicResponseDto[];

    @Expose()
    total!: number;
}
