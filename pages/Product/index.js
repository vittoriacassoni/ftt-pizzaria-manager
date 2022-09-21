import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

import {
  createTableProduto,
  obtemProduto,
  adicionaProduto,
  alteraProduto,
  excluiProduto,
  excluiTodosProdutos,
} from '../../services/dbservice';
import styles from './styles';

export default function Produto() {

  const [id, setId] = useState();
  const [descricao, setDescricao] = useState();
  const [valor, setValor] = useState();
  const [produtos, setProdutos] = useState([]);
  let tabelasCriadas = false;

  async function processamentoUseEffect() {
    if (!tabelasCriadas) {
      console.log("Verificando necessidade de criar tabelas...");
      tabelasCriadas = true;
      await createTableProduto();
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
        console.log(produtos);
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
    setDescricao('');
    setValor('');
    setId('');
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

      <View>
        <Text style={styles.labelCampo}>Código</Text>
        <TextInput style={styles.campoEdicao}
          onChangeText={(texto) => setId(texto)}
          value={id} />
      </View>

      <View>
        <Text style={styles.labelCampo}>Descrição</Text>
        <TextInput style={styles.campoEdicao}
          onChangeText={(texto) => setDescricao(texto)}
          value={descricao} />
      </View>

      <View style={styles.areaTelefone}>
          <Text style={styles.labelCampo}> Preço unitário</Text>
          <TextInput style={styles.campoEdicao}
            onChangeText={(texto) => setValor(texto)}
            value={valor}
            keyboardType='numeric' />
        </View>

        <View style={styles.areaBotao}>
          <TouchableOpacity style={[styles.botao, styles.sombra]}
            onPress={() => salvaDados()}
          >
            <Text style={styles.textoBotao}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao, styles.sombra]}
            onPress={() => limparCampos()}>
            <Text style={styles.textoBotao}>Limpar</Text>
          </TouchableOpacity>

        </View>

      <StatusBar style="auto" />
    </View>
  );
}