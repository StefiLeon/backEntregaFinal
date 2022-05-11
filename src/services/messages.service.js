import Message from '../models/Message.js';
import GenericQueries from './genericQueries.js';

export default class MessageService extends GenericQueries {
    constructor(dao) {
        super(dao, Message.model)
    }
    getMessagesAndPopulate = async(params) => {
        let result = await this.dao.models[Message.model].find(params).populate('author');
        return result;
    }
}