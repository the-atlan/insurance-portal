'use client';

import styles from "./page.module.css"
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Table, Card, Input, Button, Dropdown, Checkbox, Space, Typography, Flex, Grid} from 'antd';
import Link from 'next/link';
import {useSubmissions} from "@/hooks/useForm";
import {useTranslation} from "react-i18next";

const { Title } = Typography;
const { Search } = Input;

interface Column {
    title: string,
    dataIndex: string,
    key: string,
    sorter: (a: Record<string, string | number>, b: Record<string, string | number>) => number
}

const { useBreakpoint } = Grid;

const SubmissionsPage = () => {
    const { t  } = useTranslation('common');

    const [allColumns, setAllColumns] = useState<Column[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');

    const screens = useBreakpoint();

    const { data: submissions, isLoading: isSubmissionsLoading } = useSubmissions();

    const setColumns = useCallback(() => {
        if (!submissions?.columns) return; // Add a guard clause

        const tableColumns = submissions.columns.map((colName: string) => ({
            title: colName,
            dataIndex: colName,
            key: colName,
            sorter: (a: Record<string, string | number>, b: Record<string, string | number>) => {
                const valA = a[colName];
                const valB = b[colName];

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return valA - valB;
                }
                return String(valA).localeCompare(String(valB));
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
        <div className={styles.container} dir={t('dir')}>
            <Card>
                <Title level={2}>{t('submissions.title')}</Title>
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }} vertical={!screens.md} gap={!screens.md ? 16 : 0}>
                    <Search
                        placeholder={t('submissions.search_placeholder')}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={setSearchText}
                        style={{ width: 300 }}
                    />
                    <Space>
                        <Dropdown popupRender={() => columnSelectorMenu} trigger={['click']}>
                            <Button>{t('submissions.select_columns')}</Button>
                        </Dropdown>
                        <Link href="/apply">
                            <Button type="primary">{t('submissions.add_new_application')}</Button>
                        </Link>
                    </Space>
                </Flex>

                <Table
                    loading={isSubmissionsLoading}
                    dataSource={filteredData}
                    columns={activeColumns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    );
};

export default SubmissionsPage;