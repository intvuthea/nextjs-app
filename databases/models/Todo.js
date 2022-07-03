import { TABLE_TODO, SEQUELIZE } from '@databases/db';
import { DataTypes } from 'sequelize';


const Todo = SEQUELIZE.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    todo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE(3),
        defaultValue: SEQUELIZE.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: false
}, {
    tableName: TABLE_TODO
});

export default Todo