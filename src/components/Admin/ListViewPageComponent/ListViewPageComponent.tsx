import React, { useState } from "react";

import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  Row,
} from "@tanstack/react-table";

import {
  Text,
  Checkbox,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  Link,
  Button,
  Container,
  Box,
  Flex,
  Select,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { AddressWithGroupsAndVisits, AddressWithVisits } from "~/types";
import { api } from "~/utils/api";
import { Address, VisitStatus } from "@prisma/client";
import { getStatusColor, StatusColors, StatusNames } from "~/common/status";
import { MdAdd } from "react-icons/md";
import { AssignAddressesToGroup, CreateAddressForm } from "./Forms";
import { LogVisitModal } from "~/components/Global/LogVisitModal";

const ListViewPageComponent = () => {
  const utils = api.useContext();

  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([]);

  const [selectedAddress, setSelectedAddress] = useState<Address>();

  const isAddressSelected = (location: Address) =>
    selectedAddresses.some((l) => l.id === location.id);

  const handleAddressSelect = (address: Address) => {
    if (isAddressSelected(address)) {
      setSelectedAddresses([
        ...selectedAddresses.filter((u) => u.id !== address.id),
      ]);
    } else {
      setSelectedAddresses([...selectedAddresses, address]);
    }
  };

  const clearSelectedLocations = () => setSelectedAddresses([]);

  const {
    isOpen: isCreateUserModalOpen,
    onOpen: openCreateUserModal,
    onClose: closeCreateUserModal,
  } = useDisclosure();

  const {
    isOpen: isAssignUsersModalOpen,
    onOpen: openAssignUsersModal,
    onClose: closeAssignUsersModal,
  } = useDisclosure();

  const {
    isOpen: isLogModalOpen,
    onOpen: openLogModal,
    onClose: closeLogModal,
  } = useDisclosure();

  const handleOpenLogModal = (address: Address) => {
    setSelectedAddress(address);

    openLogModal();
  };

  const handleLogModalSuccess = (address: Address | null) => {
    void utils.address.list.refetch();

    closeLogModal();
  };

  const columns: ColumnDef<AddressWithGroupsAndVisits>[] = [
    {
      header: () => null,
      id: "1234",
      cell: ({ row }: { row: Row<AddressWithGroupsAndVisits> }) => (
        <Checkbox
          colorScheme={"teal"}
          isChecked={isAddressSelected(row.original)}
          onChange={() => handleAddressSelect(row.original)}
        />
      ),
    },
    {
      header: "status",
      id: "status",
      cell: ({ row }: { row: Row<AddressWithGroupsAndVisits> }) => (
        <Tooltip label={StatusNames[row.original.status]}>
          <svg
            height={20}
            viewBox="0 0 24 24"
            className={"cursor-pointer stroke-none "}
          >
            <circle
              cx="10"
              cy="10"
              r="9"
              stroke={"black"}
              strokeWidth="1"
              fill={StatusColors[row.original.status]}
            />
          </svg>
        </Tooltip>
      ),
    },

    {
      header: "address",
      accessorKey: "street",
      cell: (info) => info.getValue() as string,
      footer: (props) => props.column.id,
    },

    {
      header: "assigned to",
      id: "group",
      cell: ({ row }: { row: Row<AddressWithGroupsAndVisits> }) => (
        <Text>{row.original.group?.name || "-"}</Text>
      ),
    },

    {
      header: "details",
      id: "details",
      cell: ({ row }: { row: Row<AddressWithGroupsAndVisits> }) => (
        <Link href={`/admin/address/${row.original.id}`}>
          <Button colorScheme={"blue"}>Details</Button>
        </Link>
      ),
    },
    {
      header: "log",
      id: "log",
      cell: ({ row }: { row: Row<AddressWithGroupsAndVisits> }) => (
        <Button
          onClick={() => {
            handleOpenLogModal(row.original);
          }}
          colorScheme={"blue"}
        >
          Log Visit
        </Button>
      ),
    },
  ];

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const [searchFilter, setSearchFilter] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>();

  const addressQuery = api.address.list.useQuery({
    pageIndex,
    pageSize,
    search: searchFilter,
    status: statusFilter as VisitStatus,
  });
  const totalAddresses = addressQuery?.data?.count || 0;

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const table = useReactTable({
    data: addressQuery.data?.addresses ?? [],
    // @ts-ignore
    columns,
    pageCount: addressQuery.data?.count
      ? Math.trunc(addressQuery.data.count / pageSize)
      : -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    debugTable: true,
  });

  return (
    <Box p={5}>
      <Flex
        w="full"
        paddingLeft={5}
        paddingRight={5}
        mb={5}
        justifyContent={"space-between"}
      >
        <Text
          alignSelf={"center"}
          color="teal.500"
          fontSize="1.5rem"
          fontWeight="semi-bold"
        >
          Total Addresses: {totalAddresses}
        </Text>
        <Flex gap={3}>
          {/*<Button*/}
          {/*  onClick={openCreateUserModal}*/}
          {/*  leftIcon={<MdAdd fontSize={22} />}*/}
          {/*  colorScheme="teal"*/}
          {/*>*/}
          {/*  Add*/}
          {/*</Button>*/}

          <Button
            isDisabled={selectedAddresses.length === 0}
            onClick={openAssignUsersModal}
            colorScheme="teal"
          >
            Assign
          </Button>
        </Flex>
      </Flex>
      {/*<CreateAddressForm*/}
      {/*  isOpen={isCreateUserModalOpen}*/}
      {/*  onClose={closeCreateUserModal}*/}
      {/*/>*/}

      <AssignAddressesToGroup
        isOpen={isAssignUsersModalOpen}
        onClose={closeAssignUsersModal}
        addresses={selectedAddresses}
        clearSelectedAddresses={clearSelectedLocations}
      />

      <LogVisitModal
        isOpen={isLogModalOpen}
        onClose={closeLogModal}
        addressId={selectedAddress?.id}
        onSuccess={handleLogModalSuccess}
      />

      <TableContainer>
        <Flex gap={2} width={["100%", "40%"]}>
          <FormControl>
            <Input
              onChange={(e) => {
                resetPagination();

                setSearchFilter(e.currentTarget.value);
              }}
              placeholder={"Search"}
            />
          </FormControl>

          <FormControl>
            <Select
              backgroundColor={"white"}
              onChange={(e) => {
                resetPagination();

                if (e.currentTarget.value === "all") {
                  setStatusFilter(undefined);
                } else {
                  setStatusFilter(e.currentTarget.value as VisitStatus);
                }
              }}
            >
              <option value={"all"}>Status (All)</option>
              {Object.entries(StatusNames).map((s, i) => (
                <option key={i} value={s[0]}>
                  {s[1]}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th key={header.id} colSpan={header.colSpan}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() === 0 || table.getPageCount() === -1
                ? 1
                : table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1"
            />
          </span>
          <Select
            width={200}
            minWidth={200}
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50, 100, 250].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          {addressQuery.isFetching ? "Loading..." : null}
        </div>
        <div>{table.getRowModel().rows.length} Rows</div>
      </TableContainer>
    </Box>
  );
};

export default ListViewPageComponent;
