import { Grid } from '@material-ui/core'
import React from 'react'

function EditProfile() {
    return (
        <div className="editprofile">
            <Grid container>
                <Grid item sm={4}>
                    <p>Edit Profile</p>
                    <p>Change Password</p>
                </Grid>
                <Grid item sm={8}>
                    <div>
                        <p>alex_kvashilava</p>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default EditProfile
