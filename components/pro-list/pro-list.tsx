'use client';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ListRestart, Loader, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { Fragment, useEffect, useImperativeHandle, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import Empty from '../customize/empty';
import { ColumnFilter, IParams } from './column-filter';
import { Pagination } from './pagination';

export interface ProListProps<TData, TValue> {
  request: (
    pagination: {
      page: number;
      size: number;
    },
    filter: TValue,
  ) => Promise<{ list: TData[]; total: number }>;
  params?: IParams[];
  header?: {
    title?: React.ReactNode;
    toolbar?: React.ReactNode | React.ReactNode[];
  };
  batchRender?: (rows: TData[]) => React.ReactNode[];
  renderItem: (item: TData, checkbox: React.ReactNode) => React.ReactNode;
  action?: React.Ref<ProListActions | undefined>;
}
export interface ProListActions {
  refresh: () => void;
  reset: () => void;
}

export function ProList<TData, TValue extends Record<string, unknown>>({
  request,
  params,
  header,
  batchRender,
  renderItem,
  action,
}: ProListProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});
  const [data, setData] = useState<TData[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);

  const table = useReactTable({
    data,
    columns: [],
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    manualFiltering: true,
    rowCount: rowCount,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await request(
        {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
        },
        Object.fromEntries(columnFilters.map((item) => [item.id, item.value])) as TValue,
      );
      setData(response.list);
      setRowCount(response.total);
    } catch (error) {
      console.log('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    table.resetColumnFilters();
    table.resetGlobalFilter(true);
    table.resetColumnVisibility();
    setRowSelection({});
    table.resetPagination();
  };

  useImperativeHandle(action, () => ({
    refresh: fetchData,
    reset,
  }));

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, columnFilters]);

  const handleSelectionChange = (index: number, isSelected: boolean) => {
    setRowSelection((prevSelection) => ({
      ...prevSelection,
      [index]: isSelected,
    }));
  };

  const selectedRows = data.filter((_, index) => rowSelection[index]);
  const selectedCount = selectedRows.length;

  return (
    <div className='flex max-w-full flex-col gap-4 overflow-hidden'>
      <div className='flex flex-wrap-reverse items-center justify-between gap-4'>
        <div>
          {params ? (
            <ColumnFilter
              table={table}
              params={params}
              filters={Object.fromEntries(columnFilters.map((item) => [item.id, item.value]))}
            />
          ) : (
            header?.title
          )}
        </div>
        <div className='flex flex-1 items-center justify-end gap-2'>
          <Button variant='outline' className='h-8 w-8 p-2' onClick={fetchData}>
            <RefreshCcw className='h-4 w-4' />
          </Button>
          <Button variant='outline' className='h-8 w-8 p-2' onClick={reset}>
            <ListRestart className='h-4 w-4' />
          </Button>
          {header?.toolbar}
        </div>
      </div>

      {selectedCount > 0 && batchRender && (
        <BatchActionsSection<TData> selectedRows={selectedRows} batchRender={batchRender} />
      )}

      <div className='relative overflow-x-auto'>
        <div className='grid grid-cols-1 gap-4'>
          {data.length ? (
            data.map((item, index) => {
              const isSelected = !!rowSelection[index];

              const checkbox = (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(value) => handleSelectionChange(index, !!value)}
                  aria-label='Select row'
                />
              );

              return <div key={index}>{renderItem(item, checkbox)}</div>;
            })
          ) : (
            <div className='flex items-center justify-center py-24'>
              <Empty />
            </div>
          )}
        </div>

        {loading && (
          <div className='absolute top-0 z-20 flex h-full w-full items-center justify-center bg-muted/80'>
            <Loader className='h-4 w-4 animate-spin' />
          </div>
        )}
      </div>
      {rowCount > 0 && <Pagination table={table} />}
    </div>
  );
}

function BatchActionsSection<TData>({
  selectedRows,
  batchRender,
}: {
  selectedRows: TData[];
  batchRender: (rows: TData[]) => React.ReactNode[];
}) {
  const t = useTranslations('common.table');
  return (
    <Alert className='flex items-center justify-between'>
      <AlertTitle className='m-0'>{t('selectedItems', { total: selectedRows.length })}</AlertTitle>
      <AlertDescription className='flex gap-2'>
        {batchRender(selectedRows).map((item, index) => (
          <Fragment key={index}>{item}</Fragment>
        ))}
      </AlertDescription>
    </Alert>
  );
}
