'use client';
import React from 'react';
import { Card, Button, Typography, Space, Flex } from 'antd';
import Link from 'next/link';
import styles from './page.module.css';
import {useTranslation} from "react-i18next";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { t  } = useTranslation('common');

  return (
      <Flex
          justify="center"
          align="center"
          className={styles.fullHeightContainer}
          dir={t('dir')}
      >
        <Card className={styles.card}>
          <Title level={1} style={{ textAlign: 'center' }}>
            {t('home.title')}
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: '24px' }}>
            {t('home.description')}
          </Paragraph>

          <Flex justify="center">
            <Space size="large">
              <Link href="/apply" passHref>
                <Button type="primary" size="large">
                  {t('home.new_application')}
                </Button>
              </Link>
              <Link href="/submissions" passHref>
                <Button size="large">
                  {t('home.submissions')}
                </Button>
              </Link>
            </Space>
          </Flex>
        </Card>
      </Flex>
  );
};

export default HomePage;