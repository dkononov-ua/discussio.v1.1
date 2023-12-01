import * as nodemailer from 'nodemailer'



async function sendMail(html : string, mail : string) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true,
        auth:{
            user: 'discussio.inc@gmail.com',
            pass: 'cgzz dmsb hxui ivts'
        }
    })
    

    const info = await transporter.sendMail({
        from: 'Discussio <discussio.space>',
        to: mail,
        subject: 'Код підтвердження',
        html: html,
    })


    console.log('Message send:' + info.messageId + mail)
}
  


export default sendMail