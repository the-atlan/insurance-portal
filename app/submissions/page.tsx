// app/submissions/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Card, Input, Button, Dropdown, Checkbox, Space, Tag, Typography, Flex } from 'antd';
import type { TableProps } from 'antd';
import Link from 'next/link';

const { Title } = Typography;
const { Search } = Input;

// داده‌های شبیه‌سازی شده از API شما
const mockSubmissionsResponse = {
    "columns": ["Full Name", "Age", "Insurance Type", "City", "Status"],
    "data": [
        { "id": "1", "Full Name": "John Doe", "Age": 28, "Insurance Type": "Health", "City": "New York", "Status": "Pending" },
        { "id": "2", "Full Name": "Jane Smith", "Age": 32, "Insurance Type": "Life", "City": "Los Angeles", "Status": "Approved" },
        { "id": "3", "Full Name": "Alice Brown", "Age": 40, "Insurance Type": "Car", "City": "Chicago", "Status": "Rejected" },
        { "id": "4", "Full Name": "Bob Johnson", "Age": 25, "Insurance Type": "Health", "City": "New York", "Status": "Approved" }
    ]
};

const SubmissionsPage = () => {
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [allColumns, setAllColumns] = useState<any[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');

    // ====== رنگ‌بندی تگ وضعیت ======
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'green';
            case 'Pending': return 'orange';
            case 'Rejected': return 'red';
            default: return 'default';
        }
    };

    useEffect(() => {
        // شبیه‌سازی دریافت لیست از API
        setTimeout(() => {
            const { columns, data } = mockSubmissionsResponse;

            const tableColumns = columns.map(colName => ({
                title: colName,
                dataIndex: colName,
                key: colName,
                sorter: (a: any, b: any) => {
                    if (typeof a[colName] === 'number') return a[colName] - b[colName];
                    return String(a[colName]).localeCompare(String(b[colName]));
                },
                // رندر کردن تگ برای ستون وضعیت
                ...(colName === 'Status' && {
                    render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>
                })
            }));

            setAllColumns(tableColumns);
            setVisibleColumns(columns); // در ابتدا همه ستون‌ها نمایش داده شوند
            setSubmissions(data as any);
            setLoading(false);
        }, 1000);
    }, []);

    // ====== منطق جستجو و فیلتر ======
    const filteredData = useMemo(() => {
        if (!searchText) return submissions;
        return submissions.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [submissions, searchText]);

    const activeColumns = useMemo(() => {
        return allColumns.filter(col => visibleColumns.includes(col.key));
    }, [allColumns, visibleColumns]);

    // ====== منوی انتخاب ستون ======
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
                        onSearch={setSearchText}
                        onChange={(e) => setSearchText(e.target.value)}
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
                    loading={loading}
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