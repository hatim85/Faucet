import React from 'react';
import '../stylesheets/Loading.css';

function Loading() {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Transaction in progress, please wait...</p>
        </div>
    );
}

export default Loading;
