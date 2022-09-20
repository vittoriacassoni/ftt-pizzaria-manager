import * as SQLite from 'expo-sqlite';


export function getDbConnection() {
    const cx = SQLite.openDatabase('dbUsuario.db');
    return cx;
}

export async function createTable() {
    return new Promise((resolve, reject) => {
        const query = `CREATE TABLE IF NOT EXISTS tbUsuarios
        (
            codigo text not null primary key,
            nome text not null,
            email text not null,
            senha text not null          
        )`;

        let dbCx = getDbConnection();
        dbCx.transaction(tx => {
            tx.executeSql(
                query, [],
                (tx, resultado) => resolve(true)
            )
        },
            error => {
                console.log(error);
                resolve(false);
            }
        );
    });
};




export function obtemUsuario() {

    return new Promise((resolve, reject) => {

        let dbCx = getDbConnection();
        dbCx.transaction(tx => {
            let query = 'select * from tbUsuarios';
            tx.executeSql(query, [],
                (tx, registros) => {

                    var retorno = []

                    for (let n = 0; n < registros.rows.length; n++) {
                        let obj = {
                            codigo: registros.rows.item(n).codigo,
                            nome: registros.rows.item(n).nome,
                            email: registros.rows.item(n).email,
                            senha: registros.rows.item(n).senha
                        }
                        retorno.push(obj);
                    }
                    resolve(retorno);
                })
        },
            error => {
                console.log(error);
                resolve([]);
            }
        )
    }
    );
}

export function adicionaUsuario(usuario) {

    return new Promise((resolve, reject) => {
        let query = 'insert into tbUsuarios (codigo, nome ,email, senha) values (?,?,?,?)';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [usuario.codigo, usuario.nome, usuario.email, usuario.senha],
                (tx, resultado) => {
                    resolve(resultado.rowsAffected > 0);
                })
        },
            error => {
                console.log(error);
                resolve(false);
            }
        )
    }
    );
}


export function alteraUsuario(usuario) {
    console.log('começando o método alteraUsuario');
    return new Promise((resolve, reject) => {
        let query = 'update tbUsuarios set nome=?, email=?, senha=? where codigo=?';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [usuario.nome, usuario.email, usuario.senha, usuario.codigo],
                (tx, resultado) => {
                    resolve(resultado.rowsAffected > 0);
                })
        },
            error => {
                console.log(error);
                resolve(false);
            }
        )
    }
    );
}



export function excluiUsuario(codigo) {
    console.log('Apagando usuario ' + codigo);
    return new Promise((resolve, reject) => {
        let query = 'delete from tbUsuarios where codigo=?';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [codigo],
                (tx, resultado) => {
                    resolve(resultado.rowsAffected > 0);
                })
        },
            error => {
                console.log(error);
                resolve(false);
            }
        )
    }
    );
}


export function excluiTodosUsuarios() {
    console.log("Apagando todos os usuarios...");
    return new Promise((resolve, reject) => {
        let query = 'delete from tbUsuarios';
        let dbCx = getDbConnection();
        dbCx.transaction(tx => {
            tx.executeSql(query, [],
                (tx, resultado) => resolve(resultado.rowsAffected > 0)
            );
        },
            error => {
                console.log(error);
                resolve(false);
            }
        );
    }
    );
}
