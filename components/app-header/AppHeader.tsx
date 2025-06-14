"use client";

import {Drawer, Flex, Grid, Menu, Button, Switch, Select} from "antd";
import styles from "./AppHeader.module.css";
import React, {useContext, useState} from "react";
import Link from "next/link";
import {HomeFilled, IdcardFilled, SafetyCertificateFilled, MenuOutlined, SunFilled, MoonFilled} from "@ant-design/icons";
import {ThemeContext} from "@/contexts/Theme.context";
import {useTranslation} from "react-i18next";

const { useBreakpoint } = Grid;

const AppHeader = () => {
    const supportedLanguages = [
        {
            label: "English",
            value: "en"
        },
        {
            label: "فارسی",
            value: "fa"
        }
    ]

    const { t, i18n } = useTranslation('common');

    const theme = useContext(ThemeContext);

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
                    {t('header.home')}
                </Link>
            ),
            icon: <HomeFilled />
        },
        {
            key: 2,
            label: (
                <Link href='/apply'>
                    {t('header.new_application')}
                </Link>
            ),
            icon: <SafetyCertificateFilled />
        },
        {
            key: 3,
            label: (
                <Link href='/submissions'>
                    {t('header.submissions')}
                </Link>
            ),
            icon: <IdcardFilled />
        },
    ]

    const changeLanguage = (newLang: string) => {
        i18n.changeLanguage(newLang)
    }

    return (
        <Flex dir={t('dir')} className={styles.header} component="header" justify="space-between" align="center">
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

            <Flex align="center" gap={16}>
                <Select defaultValue={"en"} options={supportedLanguages} onChange={changeLanguage}/>
                <Switch checked={theme.theme === "dark"} onChange={theme.toggleTheme} unCheckedChildren={<SunFilled />} checkedChildren={<MoonFilled />}  />
                <span style={{ color: theme.theme === "dark" ? "#fff" : "#000" }}>{t('logo')}</span>
            </Flex>

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