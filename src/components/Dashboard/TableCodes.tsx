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
import { fetchPaginatedCodes, generateCode } from "@/services/codeService";

interface Code {
	id: string;
	code: string;
	used: boolean;
	createdAt: Date;
}

export default function TableCodes() {
	const [page, setPage] = useState(1);
	const [codes, setCodes] = useState<Code[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const rowsPerPage = 12;
	const loadingState = isLoading || codes?.length === 0 ? "loading" : "idle";

	const pages = Math.ceil(codes.length / rowsPerPage);

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return codes.slice(start, end);
	}, [page, codes]);

	useEffect(() => {
		const fetchCodes = async () => {
			setIsLoading(true);
			const { data }: any = await fetchPaginatedCodes();
			setCodes(data);
			setIsLoading(false);
		};

		fetchCodes();
	}, []);

	const addNewCode = async () => {
		const { newData }: any = await generateCode();
		setCodes([newData, ...codes]);
	};

	return (
		<div>
			<div className="flex items-center mb-4">
				<Button color="primary" onPress={addNewCode}>
					Generar Codigo
				</Button>
			</div>

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
					<TableColumn key="code">CODIGO</TableColumn>
					<TableColumn key="used">USADO</TableColumn>
					<TableColumn key="createdAt">FECHA DE CREACION</TableColumn>
				</TableHeader>
				<TableBody
					items={items}
					emptyContent={"No hay codigos existentes."}
					loadingContent={<Spinner />}
					loadingState={loadingState}
				>
					{(item) => (
						<TableRow key={item.id}>
							<TableCell>{item.code}</TableCell>
							<TableCell>{item.used ? "Si" : "No"}</TableCell>
							<TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
