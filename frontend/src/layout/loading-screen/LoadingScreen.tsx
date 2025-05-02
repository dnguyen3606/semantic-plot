import {Loader} from "@mantine/core";
import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
    return (
        <div className={styles.loadingScreenBackground}>
            <Loader style={{alignSelf:'center'}} type='dots' size='xl'/>
        </div>
    )
}