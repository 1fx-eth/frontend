import React, { useMemo } from "react";
import { ALL_COINS } from "../../config/networks.config";
import { SlotData } from "../../contracts/fx.contracts";


interface TableProps {
    slots: SlotData[]
}
export const PositionTable = ({ slots }: TableProps) => {

    return <table>
        {PositinHeader()}
        {slots.map(s => <PositionRow slot={s} />)}
    </table>
}

interface RowProps {
    slot: SlotData
}

const PositionRow = ({ slot }: RowProps) => {

    const [debt, collateral, nav, leverage] = useMemo(
        () => {
            const collateral = Number(slot.totalCollateralBase)
            const debt = Number(slot.totalDebtBase)
            let nav = (collateral - debt)
            const leverage = collateral / nav
            nav /= 1e8
            return [debt.toLocaleString(), collateral.toLocaleString(), nav.toLocaleString(), leverage.toLocaleString(undefined, { minimumFractionDigits: 2 })]
        },
        [slot]
    )

    const [imgCollat, imgDebt, symbolCollat, symbolDebt] = useMemo(() => {
        const collateralSlot = ALL_COINS.find(c => c.address.toLowerCase() === slot.collateral.toLowerCase())
        const debtSlot = ALL_COINS.find(c => c.address.toLowerCase() === slot.debt.toLowerCase())
        return [
            collateralSlot?.icon,
            debtSlot?.icon,
            collateralSlot?.symbol,
            debtSlot?.symbol
        ]
    },
        [slot]
    )
    return <tr>
        <td>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <img src={imgCollat} style={{ width: '20px', height: '100%' }} />
                -
                <img src={imgDebt} style={{ width: '20px', height: '100%' }} />
            </div>
            {symbolCollat}-{symbolDebt}
        </td>
        <td>
            {leverage}x
        </td>
        <td>
            ${nav}
        </td>

    </tr>

}


const PositinHeader = () => {


    return <thead>
        <td>
            Pair
        </td>
        <td>
            Leverage
        </td>
        <td>
            Position Sizes
        </td>

    </thead>

}