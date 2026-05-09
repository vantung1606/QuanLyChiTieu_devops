import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FinancialTip() {
  const { t } = useTranslation();
  return (
    <div className="tip-card">
      <h4>{t('Financial Tip')}</h4>
      <p>{t('50/30/20 rule tip')}</p>
    </div>
  );
}
