import React from 'react';
// Import komponen UI yang sudah kita rapikan
import ManajemenModul from '@/Components/ManajemenModul'; 

interface Props {
    auth: any;
    modules: any[]; // Data modul dari database
    globalSoftSkills: string[]; // Data soft skills dari database
}

export default function Index(props: Props) {
    // Render komponen UI dan oper data (props) ke dalamnya
    return (
        <ManajemenModul 
            auth={props.auth}
            modules={props.modules}
            globalSoftSkills={props.globalSoftSkills}
        />
    );
}