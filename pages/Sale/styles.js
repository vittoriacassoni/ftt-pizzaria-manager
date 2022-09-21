import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 25,
        color: '#FFF',
        backgroundColor: '#6b8e23',
        width: 300,
        textAlign: 'center',
        alignItems: 'flex-start'
    },
    labelCampo: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
    },
    campoEdicao: {
        borderBottomColor: '#004D00',
        borderBottomWidth: 2,
        width: 200,
        height: 40,
        fontSize: 17,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    areaBotao: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
    },
    botao: {
        width: '50%',
        height: 60,
        backgroundColor: '#004D00',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoBotao:{
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

});


export default styles;