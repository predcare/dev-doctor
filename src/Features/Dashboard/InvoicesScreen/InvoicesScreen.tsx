import React from 'react'
import ComingSoonScreen from '../../ComingSoonScreen'

const InvoicesScreen: React.FC = () => {
    return (
        <ComingSoonScreen
            title="Invoices"
            description="Your invoices will appear here."
            showBottomBar={true}
            activeBottomTab="Invoices"
        />
    )
}

export default InvoicesScreen
