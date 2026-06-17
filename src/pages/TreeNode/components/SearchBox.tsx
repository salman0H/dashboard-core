// src/pages/TreeNode/components/SearchBox.tsx
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBox({ value, onChange, placeholder }: SearchBoxProps) {
  const { t } = useTranslation('tree')
  const defaultPlaceholder = placeholder || t('searchPlaceholder')

  return (
    <div className="mt-3">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={defaultPlaceholder}
        prefix={<SearchOutlined className="text-gray-400" />}
        allowClear
        className="w-full"
        size="middle"
      />
    </div>
  )
}