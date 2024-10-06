import {connect,ConnectOptions} from 'mongoose';
export const dbConnect=()=>{
    connect(process.env.MONGO_URL!,{
        tls: true,
        tlsAllowInvalidCertificates: true, // Use with caution. For development only.
        tlsAllowInvalidHostnames: true
    } as ConnectOptions).then(
        ()=>console.log('database connected successfully'),
        (error)=>console.log(error)
        
        
    )
}