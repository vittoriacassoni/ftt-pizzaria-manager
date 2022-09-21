import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import {
  createTable,
  obtemProduto,
  adicionaProduto,
  alteraProduto,
  excluiProduto,
  excluiTodosProdutos,
} from './services/dbservice';
import styles from './styles';

export default function App() {

  const [id, setId] = useState();
  const [descricao, setDescricao] = useState();
  const [valor, setValor] = useState();
  const [produtos, setProdutos] = useState([]);
  let tabelasCriadas = false;

  async function processamentoUseEffect() {
    if (!tabelasCriadas) {
      console.log("Verificando necessidade de criar tabelas...");
      tabelasCriadas = true;
      await createTable();
    }

    console.log("UseEffect...");
    await carregaDados();
  }

  useEffect(
    () => {
      console.log('executando useffect');
      processamentoUseEffect(); //necessário método pois aqui não pode utilizar await...
    }, []);


  function createUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(0, 2);
  }

  async function salvaDados() {
    let novoRegistro = id == undefined;

    let obj = {
      id: novoRegistro? createUniqueId() : id,
      descricao: descricao,
      valor: valor,
    };

    try {

      if (novoRegistro) {
        let resposta = (await adicionaProduto(obj));

        if (resposta)
          Alert.alert('adicionado com sucesso!');
        else
          Alert.alert('Falhou miseravelmente!');
      }
      else {      
        let resposta = await alteraProduto(obj);
        if (resposta)
          Alert.alert('Alterado com sucesso!');
        else
          Alert.alert('Falhou miseravelmente!');
      }
      
      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
    } catch (e) {
      Alert.alert(e);
    }
  }

  function carregaDados() {
    try {
      obtemProduto().then((resposta) => {

        let produtos = resposta;
        setProdutos(produtos);
      })

    } catch (e) {
      Alert.alert(e.toString());
    }
  }

  function editar(identificador) {
    const produto = produtos.find(produto => produto.id == identificador);

    if (produto != undefined) {
      setId(produto.id);
      setDescricao(produto.descricao);
      setValor(produto.valor);
    }

    console.log(produto);
  }

  async function limparCampos() {
    setDescricao("");
    setValor("");
    setId(undefined);
    Keyboard.dismiss();
  }

  async function efetivaExclusao() {
    try {
      await excluiTodosProdutos();
      await carregaDados();
    }
    catch (e) {
      Alert.alert(e);
    }
  }

  function apagarTudo() {
    if (Alert.alert('Muita atenção!!!', 'Confirma a exclusão de todos os contatos?',
      [
        {
          text: 'Sim, confirmo!',
          onPress: () => {
            efetivaExclusao();
          }
        },
        {
          text: 'Não!!!',
          style: 'cancel'
        }
      ]));
  }

  async function efetivaRemoverProduto(identificador) {
    try {
      await excluiProduto(identificador);
      Keyboard.dismiss();
      limparCampos();
      await carregaDados();
      Alert.alert('Contato apagado com sucesso!!!');
    } catch (e) {
      Alert.alert(e);
    }
  }

  function removerElemento(identificador) {
    Alert.alert('Atenção', 'Confirma a remoção do contato?',
      [
        {
          text: 'Sim',
          onPress: () => efetivaRemoverProduto(identificador),
        },
        {
          text: 'Não',
          style: 'cancel',
        }
      ]);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>PRODUTOS</Text>
      <Text /><Text />

      <View>
        <Text>Descrição</Text>
        <TextInput style={styles.caixaTexto}
          onChangeText={(texto) => setDescricao(texto)}
          value={descricao} />
      </View>

      <View style={styles.areaTelefone}>
          <Text>Preço unitário</Text>
          <TextInput style={styles.caixaTexto}
            onChangeText={(texto) => setValor(texto)}
            value={valor}
            keyboardType='numeric' />
        </View>

      <StatusBar style="auto" />
    </View>
  );
}