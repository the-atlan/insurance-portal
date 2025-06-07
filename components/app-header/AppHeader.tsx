"use client";

import {Drawer, Flex, Grid, Menu, Button} from "antd";
import styles from "./AppHeader.module.css";
import React, {useState} from "react";
import Link from "next/link";
import {HomeFilled, IdcardFilled, SafetyCertificateFilled, MenuOutlined} from "@ant-design/icons";

const { useBreakpoint } = Grid;

const AppHeader = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);

    const screens = useBreakpoint();

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onDrawerClose = () => {
        setDrawerVisible(false);
    };

    const menuItems = [
        {
            key: 1,
            label: (
                <Link href='/'>
                    Home
                </Link>
            ),
            icon: <HomeFilled />
        },
        {
            key: 2,
            label: (
                <Link href='/apply'>
                    New Application
                </Link>
            ),
            icon: <SafetyCertificateFilled />
        },
        {
            key: 3,
            label: (
                <Link href='/submissions'>
                    Submissions
                </Link>
            ),
            icon: <IdcardFilled />
        },
    ]
    return (
        <Flex className={styles.header} component="header" justify="space-between" align="center">
            {screens.md ? (
                <Menu
                    className={styles.navbar}
                    items={menuItems}
                    mode="horizontal"
                />
            ) : (
                <Button
                    type="primary"
                    onClick={showDrawer}
                    icon={<MenuOutlined />}
                />
            )}

            <span>LOGO</span>

            <Drawer
                title="Menu"
                placement="right"
                onClose={onDrawerClose}
                open={drawerVisible}
                destroyOnHidden={true}
            >
                <Menu
                    items={menuItems}
                    mode="vertical"
                    onClick={onDrawerClose}
                />
            </Drawer>
        </Flex>
    )
}

export default AppHeader;