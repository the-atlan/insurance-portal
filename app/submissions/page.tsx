'use client';

import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { Table, Card, Input, Button, Dropdown, Checkbox, Space, Typography, Flex } from 'antd';
import Link from 'next/link';
import {useSubmissions} from "@/hooks/useForm";

const { Title } = Typography;
const { Search } = Input;

const SubmissionsPage = () => {
    const [allColumns, setAllColumns] = useState<{ label: string, key: string }[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');

    const { data: submissions, isLoading: isSubmissionsLoading } = useSubmissions();

    const setColumns = useCallback(() => {
        if (!submissions?.columns) return; // Add a guard clause

        const tableColumns = submissions.columns.map((colName: string) => ({
            title: colName,
            dataIndex: colName,
            key: colName,
            sorter: (a: any, b: any) => {
                if (typeof a[colName] === 'number') return a[colName] - b[colName];
                return String(a[colName]).localeCompare(String(b[colName]));
            },
        }));

        setAllColumns(tableColumns);
        setVisibleColumns(submissions.columns);
    }, [submissions]);

    useEffect(() => {
        if (submissions?.columns) {
            setColumns()
        }
    }, [submissions, setColumns]);

    const filteredData = useMemo(() => {
        if (!submissions?.data?.length) return [];
        if (!searchText) return submissions.data;
        return submissions.data.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [submissions, searchText]);

    const activeColumns = useMemo(() => {
        return allColumns.filter(col => visibleColumns.includes(col.key));
    }, [allColumns, visibleColumns]);

    if (isSubmissionsLoading) {
        return <div>Loading...</div>
    }

    const columnSelectorMenu = (
        <div style={{ padding: 8, backgroundColor: 'white', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
            <Checkbox.Group
                options={allColumns.map(col => ({ label: col.title, value: col.key }))}
                value={visibleColumns}
                onChange={(checkedValues) => setVisibleColumns(checkedValues as string[])}
                style={{ display: 'flex', flexDirection: 'column' }}
            />
        </div>
    );

    return (
        <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Card>
                <Title level={2}>Submitted Applications</Title>
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search submissions..."
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={setSearchText}
                        style={{ width: 300 }}
                    />
                    <Space>
                        <Dropdown overlay={columnSelectorMenu} trigger={['click']}>
                            <Button>Select Columns</Button>
                        </Dropdown>
                        <Link href="/apply">
                            <Button type="primary">Add New Application</Button>
                        </Link>
                    </Space>
                </Flex>

                <Table
                    loading={isSubmissionsLoading}
                    dataSource={filteredData}
                    columns={activeColumns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default SubmissionsPage;