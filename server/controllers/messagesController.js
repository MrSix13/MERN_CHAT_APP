const messageModel = require("../model/messageModel");

module.exports.addMessage = async(req,res,next)=>{
    try {
        const { form, to, message} = req.body;
        const data = await messageModel.create({
            message: {text:message},
            users: [form, to],
            sender: form
        });
        if(data) return res.json({msg:"Message addedd successfuly"});
        return res.json({msg: "Failed to add message to the database"})
    } catch (ex) {
        next(ex);
    }

};

module.exports.getAllMessage = async(req,res,next)=>{
    try {
        const {form, to} = req.body;
        const messages = await messageModel
          .find({
              users:{
                  $all:[form, to]
              }
          })
           .sort({updatedAt: 1});
        const projectMessages = messages.map((msg)=>{
            return{
                formSelf: msg.sender.toString() === form,
                message: msg.message.text
            }
        });
        res.json(projectMessages);
    } catch (ex) {
        next(ex)
    }

};