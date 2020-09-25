import React from 'react'
import CopyrightIcon from '@material-ui/icons/Copyright';

function Footer() {
    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: 20, marginBottom: 20}}>
            <CopyrightIcon fontSize="small" />
            <p style={{ fontSize: 13, fontWeight: 500,color: "gray"}}> 2020 INSTAGRAM BY ALEKO</p>
        </div>
    )
}

export default Footer
