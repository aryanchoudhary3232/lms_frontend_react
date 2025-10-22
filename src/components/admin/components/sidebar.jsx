import React from "react";

export default function Sidebar(){
    return(
    <div style={{width: '100%', height: '100%', padding: 16, background: '#ffffffff', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex'}}>
    <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16, display: 'flex'}}>
        <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
            <div style={{alignSelf: 'stretch', color: 'white', fontSize: 16, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 24, wordWrap: 'break-word'}}>EduPlatform</div>
        </div>
        <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: '#29382E', borderRadius: 20, justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{width: 24, flex: '1 1 0', position: 'relative', overflow: 'hidden'}}>
                        <div style={{width: 24, height: 24, left: 0, top: 0, position: 'absolute', background: 'white'}} />
                        <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
                    </div>
                </div>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{color: 'white', fontSize: 14, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word'}}>Dashboard</div>
                </div>
            </div>
            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{width: 24, flex: '1 1 0', position: 'relative', overflow: 'hidden'}}>
                        <div style={{width: 24, height: 24, left: 0, top: 0, position: 'absolute', background: 'white'}} />
                        <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
                    </div>
                </div>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{color: 'white', fontSize: 14, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word'}}>Users</div>
                </div>
            </div>
            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{width: 24, flex: '1 1 0', position: 'relative', overflow: 'hidden'}}>
                        <div style={{width: 24, height: 24, left: 0, top: 0, position: 'absolute', background: 'white'}} />
                        <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
                    </div>
                </div>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{color: 'white', fontSize: 14, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word'}}>Instructors</div>
                </div>
            </div>
            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{width: 24, flex: '1 1 0', position: 'relative', overflow: 'hidden'}}>
                        <div style={{width: 24, height: 24, left: 0, top: 0, position: 'absolute', background: 'white'}} />
                        <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
                    </div>
                </div>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{color: 'white', fontSize: 14, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word'}}>Courses</div>
                </div>
            </div>
            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{width: 24, flex: '1 1 0', position: 'relative', overflow: 'hidden'}}>
                        <div style={{width: 24, height: 24, left: 0, top: 0, position: 'absolute', background: 'white'}} />
                        <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
                    </div>
                </div>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{color: 'white', fontSize: 14, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word'}}>Revenue</div>
                </div>
            </div>
            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{width: 24, flex: '1 1 0', position: 'relative', overflow: 'hidden'}}>
                        <div style={{width: 24, height: 24, left: 0, top: 0, position: 'absolute', background: 'white'}} />
                        <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
                    </div>
                </div>
                <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                    <div style={{color: 'white', fontSize: 14, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word'}}>Reviews</div>
                </div>
            </div>
        </div>
    </div>
    <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4, display: 'flex'}}>
        <div style={{alignSelf: 'stretch', flex: '1 1 0', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                <div style={{width: 24, flex: '1 1 0', position: 'relative', overflow: 'hidden'}}>
                    <div style={{width: 24, height: 24, left: 0, top: 0, position: 'absolute', background: 'white'}} />
                    <div style={{left: 'undefined', top: 'undefined', position: 'absolute'}} />
                </div>
            </div>
            <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                <div style={{color: 'white', fontSize: 14, fontFamily: 'Spline Sans', fontWeight: '500', lineHeight: 21, wordWrap: 'break-word'}}>Settings</div>
            </div>
        </div>
    </div>
</div>
    )
}