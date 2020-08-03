import React from 'react';
  import { makeStyles } from '@material-ui/core/styles';
  import Table from '@material-ui/core/Table';
  import TableBody from '@material-ui/core/TableBody';
  import TableCell from '@material-ui/core/TableCell';
  import TableContainer from '@material-ui/core/TableContainer';
  import TableHead from '@material-ui/core/TableHead';
  import TableRow from '@material-ui/core/TableRow';
  import Paper from '@material-ui/core/Paper';

import socket from '../../connection';
import { useEffect } from 'react';



const useStyles = makeStyles(theme => ({
  class1:{
    border: '1px solid black'
  },
  class2:{
    borderCollapse: 'collapse',
    width: '35%',
    border: '1px solid black'
  },
  class3:{
    height: '25px',
    border: '1px solid black',
  },
}))

function Dre(props){

  useEffect(()=>{
    socket.emit('puxar-balancos', props.round);
    socket.on('balancos', balanco => {
      console.log("dre", balanco.dre)
      if(balanco.dre){
        console.log(balanco.dre)
        let d = balanco.dre
        let b = balanco.balanco_patrimonial
        let p = balanco.planejado
        if(document.getElementById('balancod') !== null){ 
        let linhas = document.getElementById('balancod').querySelector('tbody').querySelectorAll('tr')
        let cel_servicos = document.getElementById('balancod').querySelector('thead').querySelectorAll('tr')[1].querySelectorAll('th')[3]
        let cel_bimestre = document.getElementById('balancod').querySelector('thead').querySelectorAll('tr')[0].querySelectorAll('th')[1]
        cel_bimestre.innerText = 'Bimestre: ' + balanco.turno
        if(d.servicos[2] == 0 || d.servicos[2] == '0'){
          cel_servicos.innerText = d.servicos[0]
          
        }
        else{
          cel_servicos.innerText = d.servicos[0] + ' - ' + d.servicos[2]
        }
        if(p!==0){
        if(p.serv1 !== 0 && p.serv2 !== 0){
          cel_servicos.innerText = p.serv1 + ' - ' + p.serv2
        }
        if(p.serv1 !== 0 && p.serv2 == 0){
          cel_servicos.innerText = p.serv1
        }
        if(p.serv1 == 0 && p.serv2 !== 0){
          cel_servicos.innerText = p.serv2
        }
      }
        console.log(linhas) 
        
        
        for(let i = 0; i < linhas.length; i++){
          let valores = linhas[i].querySelectorAll('td')
          for(let ii = 0; ii < valores.length; ii++){
            //valores[ii].innerText = valores[ii].innerText + ` (` + i + `, ` + ii + `)`
            if(i == 0 && ii == 1){
                valores[ii].innerText = Math.round(d.receita)
              if(p!==0){
                valores[ii].innerText = Math.round(p.volume1*p.preco1+p.volume2*p.preco2)
              }
              }
              if(i == 0 && ii == 3){
                valores[ii].innerText = Math.round(d.preco_medio)
                if(p!==0){
                  valores[ii].innerText = Math.round((p.preco1*p.volume1+p.preco2*p.volume2)/(p.volume2+p.volume1))
                }
              }
              if(i == 1 && ii == 3){
                valores[ii].innerText = Math.round(d.atendimentos)
                if(p!==0){
                  valores[ii].innerText = Math.round(p.volume1+p.volume2)
                }
              }
              if(i == 2 && ii == 2){
                
                valores[ii].innerText = 'Custo por Unidade ' + d.servicos[0]
                if(p!==0 && p.serv1 !== 0){
                  valores[ii].innerText = 'Custo por Unidade ' + p.serv1
                }
              }
              if(i == 2 && ii == 3){
                valores[ii].innerText = d.servicos[1]
                if(p!==0 && p.serv1 !== 0){
                  valores[ii].innerText = balanco.servs[p.serv1][2]
                }
              }
              if(d.servicos[2] !== 0){
                if(i == 3 && ii == 2){
                  valores[ii].innerText = 'Custo por Unidade ' + d.servicos[2]
                }
                if(i == 3 && ii == 3){
                  valores[ii].innerText = d.servicos[3]
                }
              }
              else{
                if(i == 3 && ii == 2){
                  valores[ii].innerText = '-'
                }
                if(i == 3 && ii == 3){
                  valores[ii].innerText = 0
                }
              }
              if(i == 3 && ii == 2){
                if(p.serv2 !== 0 && p !== 0){
                  valores[ii].innerText = 'Custo por Unidade ' + p.serv2
                }
              }
              if(i == 3 && ii == 3){
                if(p.serv2 !== 0 && p !== 0){
                  valores[ii].innerText = balanco.servs[p.serv2][2]
                }
              }
              if(i == 6 && ii == 3){
                valores[ii].innerText = Math.round(d.capacidade_n_utilizada)
              }
              if(i == 4 && ii == 3){
                valores[ii].innerText = Math.round(d.insumos_em_estoque)
                if(p!==0){
                  valores[ii].innerText = Math.round(p.insu1i+p.insu2i)
                }
              }
              if(i == 4 && ii == 1){
                valores[ii].innerText = Math.round(d.estoque_inicial)
              }
              if(i == 5 && ii == 1){
                valores[ii].innerText = Math.round(d.custo_prestacao_servico)
                if(p!==0){
                  function check1(param) {
                    if(param){
                      return param[2]
                    }
                    else{
                      return 0
                    }
                  }
                  console.log('p.volume1: '+p.volume1+' check1(balanco.servs[p.serv1]): ' +check1(balanco.servs[p.serv1]))
                  valores[ii].innerText = Math.round(p.volume1*check1(balanco.servs[p.serv1])+p.volume2*check1(balanco.servs[p.serv2]))
                }
              }
              if(i == 6 && ii == 1){
                valores[ii].innerText = Math.round(d.custo_estocagem)
                console.log('teste')
                let estocagem = (g(p.insu1)+g(p.insu2)+g(p.insu1i)+g(p.insu2i)) - (g(p.volume2)+g(p.volume1))
                function g(g) {
                  //console.log('g1: ' +g)
                  if(g > 0 ){
                    //console.log('g: ' +g)
                    return Number(g)
                  }
                  else{
                    return 0
                  }
                }
                if(p!==0 && estocagem > 0){
                  valores[ii].innerText = Math.round((estocagem*30))
                }
              }
              if(i == 7 && ii == 1){
                valores[ii].innerText = Math.round(d.custo_troca_insumos)
              }
              if(i == 8 && ii == 1){
                valores[ii].innerText = Math.round(d.hora_extra)
                if(p!== 0){

                  function g(g) {
                  //console.log('g1: ' +g)
                  if(g > 0 ){
                    //console.log('g: ' +g)
                    return Number(g)
                  }
                  else{
                    return 0
                  }
                  }
                  let hora_e = 0
        
                  if(g(p.volume1) - (g(p.insu1)+g(p.insu1i)) > 0 || g(p.volume2) - (g(p.insu2)+g(p.insu2i) > 0)){
                    let par2 = 0
                    let par1 = 0
                    par2 = (g(p.volume2) - (g(p.insu2i) + g(p.insu2)))
                    if(par2 > 0 && p.serv2 !== 0){
                      par2 = par2*balanco.servs[p.serv2][2]*0.2 
                    }
                    else{
                      par2 = 0
                    }
                    par1 = (g(p.volume1) - (g(p.insu1i) + g(p.insu1)))
                    console.log(par1)
                    if(par1 > 0 && p.serv1 !== 0){
                      par1 = par1*balanco.servs[p.serv1][2]*0.2 
                    }
                    else{
                      par1 = 0
                    }
                    console.log("par2: " +par2)
                    console.log("par1: " +par1)
                    hora_e = Math.round(par1+par2)
                  }
                  
                  valores[ii].innerText = Math.round(hora_e)
                }
              }
              if(i == 9 && ii == 2){
                valores[ii].innerText = Math.round(d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem)
              }
              if(i == 10 && ii == 2){
                valores[ii].innerText = Math.round(b.estoque) //tds as proximas utilizacoes do capacidade_n_utilizada estao errados pq represente apenas os insumos q sobraram mas tem q mostrar o estoque q sobrou
                if(p!==0){
                  function check1(param) {
                    if(param){
                      return param[2]
                    }
                    else{
                      return 0
                    }
                  }
                  if(Math.round( d.estoque_inicial  - (p.volume1*check1(balanco.servs[p.serv1])+p.volume2*check1(balanco.servs[p.serv2]))) > 0){
                    console.log('p.volume1: '+p.volume1+' check1(balanco.servs[p.serv1]): ' +check1(balanco.servs[p.serv1]))
                    valores[ii].innerText = Math.round( d.estoque_inicial  - (p.volume1*check1(balanco.servs[p.serv1])+p.volume2*check1(balanco.servs[p.serv2])))
                  }
                  else{
                    valores[ii].innerText = 0
                  }
                }
              }
              if(i == 11 && ii == 2){
                valores[ii].innerText = Math.round(d.estoque_inicial + d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem - b.estoque)
                if(p!==0){
                  let estocagem = (g(p.insu1)+g(p.insu2)+g(p.insu1i)+g(p.insu2i)) - (g(p.volume2)+g(p.volume1))
                
                  function g(g) {
                  //console.log('g1: ' +g)
                  if(g > 0 ){
                    //console.log('g: ' +g)
                    return Number(g)
                  }
                  else{
                    return 0
                  }
                  }
                  let hora_e = 0
        
                  if(g(p.volume1) - (g(p.insu1)+g(p.insu1i)) > 0 || g(p.volume2) - (g(p.insu2)+g(p.insu2i) > 0)){
                    let par2 = 0
                    let par1 = 0
                    par2 = (g(p.volume2) - (g(p.insu2i) + g(p.insu2)))
                    if(par2 > 0 && p.serv2 !== 0){
                      par2 = par2*balanco.servs[p.serv2][2]*0.2 
                    }
                    else{
                      par2 = 0
                    }
                    par1 = (g(p.volume1) - (g(p.insu1i) + g(p.insu1)))
                    console.log(par1)
                    if(par1 > 0 && p.serv1 !== 0){
                      par1 = par1*balanco.servs[p.serv1][2]*0.2 
                    }
                    else{
                      par1 = 0
                    }
                    console.log("par2: " +par2)
                    console.log("par1: " +par1)
                    hora_e = Math.round(par1+par2)
                  }
                  function check3(a) {
                    if(a){
                      return a[2]
                    }
                    else{
                      return 0
                    }
                  }
                  valores[ii].innerText = Math.round((estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)+d.custo_troca_insumos)
                }
              }
              if(i == 12 && ii == 2){
                valores[ii].innerText = Math.round(d.receita - (d.estoque_inicial + d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem - b.estoque))
                if(p!==0){
                  let estocagem = (g(p.insu1)+g(p.insu2)+g(p.insu1i)+g(p.insu2i)) - (g(p.volume2)+g(p.volume1))
                
                  function g(g) {
                  //console.log('g1: ' +g)
                  if(g > 0 ){
                    //console.log('g: ' +g)
                    return Number(g)
                  }
                  else{
                    return 0
                  }
                  }
                  let hora_e = 0
        
                  if(g(p.volume1) - (g(p.insu1)+g(p.insu1i)) > 0 || g(p.volume2) - (g(p.insu2)+g(p.insu2i) > 0)){
                    let par2 = 0
                    let par1 = 0
                    par2 = (g(p.volume2) - (g(p.insu2i) + g(p.insu2)))
                    if(par2 > 0 && p.serv2 !== 0){
                      par2 = par2*balanco.servs[p.serv2][2]*0.2 
                    }
                    else{
                      par2 = 0
                    }
                    par1 = (g(p.volume1) - (g(p.insu1i) + g(p.insu1)))
                    console.log(par1)
                    if(par1 > 0 && p.serv1 !== 0){
                      par1 = par1*balanco.servs[p.serv1][2]*0.2 
                    }
                    else{
                      par1 = 0
                    }
                    console.log("par2: " +par2)
                    console.log("par1: " +par1)
                    hora_e = Math.round(par1+par2)
                  }
                  function check3(a) {
                    if(a){
                      return a[2]
                    }
                    else{
                      return 0
                    }
                  }
                  console.log('p.insu1i+p.insu2i '+p.insu1i+p.insu2i)
                  valores[ii].innerText = Math.round(p.volume1*p.preco1+p.volume2*p.preco2 - (estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)-d.custo_troca_insumos)
                }
              }
              if(i == 13 && ii == 1){
                valores[ii].innerText = Math.round(d.atendimentos)
              if(p!==0){
                valores[ii].innerText = Math.round(p.volume1+p.volume2)
              }
              }
              if(i == 16 && ii == 1){
                valores[ii].innerText = Math.round(d.despesas_administrativas)
              }
              if(i == 17 && ii == 3){
                valores[ii].innerText = Math.round(d.salario_promotores/2160)
                if(p!==0){
                  valores[ii].innerText = Math.round(p.promotores)
                }
              }
              if(i == 18 && ii == 1){
                valores[ii].innerText = Math.round(d.salario_promotores)
              if(p!==0){
                valores[ii].innerText = Math.round(p.promotores*2160)
              }
              }
              if(i == 18 && ii == 3){
                valores[ii].innerText = d.comissao
                if(p!==0){
                  valores[ii].innerText = p.comissao
                }
              }
              if(i == 19 && ii == 3){
                valores[ii].innerText = 2160
              }
              if(i == 19 && ii == 1){
                valores[ii].innerText = Math.round(d.comissao)
                if(p!==0){
                  valores[ii].innerText = Math.round((p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2))
                }
              }
              if(i == 21 && ii == 1){
                valores[ii].innerText = Math.round(d.propaganda_institucional)
                if(p!==0){
                  valores[ii].innerText = Math.round(p.propagandai)
                }
              }
              if(i == 22 && ii == 1){
                valores[ii].innerText = Math.round(d.propaganda_unitaria)
                if(p!== 0){
                  valores[ii].innerText = Math.round(p.prop1+p.prop2)
                }
              }
              if(i == 23 && ii == 1){
                valores[ii].innerText = 2880
              }
              if(i == 23 && ii == 3){
                valores[ii].innerText = 15
              }
              if(i == 24 && ii == 1){
                valores[ii].innerText = Math.round(d.encargos_financiamento)
                if(p!==0){
                  let dive = 0
                  if(b.caixa < 0){
                    dive = b.caixa*(-1)
                  }
                  valores[ii].innerText = Math.round((dive+p.emprestimo)*0.08)
                }
              }
              if(i == 25 && ii == 3){
                valores[ii].innerText = d.salario_frota/4800
                if(p!==0){
                  valores[ii].innerText = p.frota
                }
              }
              if(i == 26 && ii == 1){
                valores[ii].innerText = Math.round(d.salario_frota)
                if(p!==0){
                  valores[ii].innerText = p.frota*4800
                }
              }
              if(i == 27 && ii == 1){
                valores[ii].innerText = Math.round(d.manutencao_frota)
                if(p!==0){
                  valores[ii].innerText = p.frota*6000
                }
              }
              if(i == 27 && ii == 3){
                valores[ii].innerText = 6000
              }
              if(i == 28 && ii == 1){
                valores[ii].innerText = Math.round(d.depreciacao_de_veiculos)
                if(p!==0){
                  valores[ii].innerText = p.frota*2400
                }
              }
              if(i == 29 && ii == 1){
                valores[ii].innerText = Math.round(d.frota_terceirizada)
              }
              if(i == 30 && ii == 1){
                valores[ii].innerText = Math.round(d.despesas_operacionais_n_planejadas)
              }
              if(i == 31 && ii == 1){
                valores[ii].innerText = Math.round(d.pas)
                if(p!==0){
                  valores[ii].innerText = p.pas*2160
                }
              }
              if(i == 31 && ii == 3){
                valores[ii].innerText = Math.round(d.pas/2160)
                if(p!==0){
                  valores[ii].innerText = p.pas
                }
              }
              if(i == 32 && ii == 1){
                valores[ii].innerText = Math.round(d.pesquisas)
                if(p!==0){
                  valores[ii].innerText = Math.round(p.pesquisas)
                }
              }
              if(i == 34 && ii == 2){
                valores[ii].innerText = Math.round(d.despesas_administrativas + d.salario_promotores + d.comissao + d.propaganda_institucional + d.propaganda_unitaria + d.depreciacao_de_maquinas + d.encargos_financiamento + d.salario_frota + d.manutencao_frota + d.depreciacao_de_veiculos + d.despesas_operacionais_n_planejadas + d.pas + d.pesquisas)
                if(p!==0){
                  valores[ii].innerText = Math.round(p.promotores*2160+(p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2) + p.propagandai + p.prop1 + p.prop2+ 2880 + p.emprestimo*0.08+p.frota*10800+p.frota*2400+p.pesquisas+p.pas*2160)
                }
              }
              if(i == 35 && ii == 1){
                valores[ii].innerText = Math.round(d.receita - (d.estoque_inicial + d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem - b.estoque) - (d.despesas_administrativas + d.salario_promotores + d.comissao + d.propaganda_institucional + d.propaganda_unitaria + d.depreciacao_de_maquinas + d.encargos_financiamento + d.salario_frota + d.manutencao_frota + d.depreciacao_de_veiculos + d.despesas_operacionais_n_planejadas + d.pas + d.pesquisas))
                if(p!==0){
                  let estocagem = (g(p.insu1)+g(p.insu2)+g(p.insu1i)+g(p.insu2i)) - (g(p.volume2)+g(p.volume1))
                
                  function g(g) {
                  //console.log('g1: ' +g)
                  if(g > 0 ){
                    //console.log('g: ' +g)
                    return Number(g)
                  }
                  else{
                    return 0
                  }
                  }
                  let hora_e = 0
        
                  if(g(p.volume1) - (g(p.insu1)+g(p.insu1i)) > 0 || g(p.volume2) - (g(p.insu2)+g(p.insu2i) > 0)){
                    let par2 = 0
                    let par1 = 0
                    par2 = (g(p.volume2) - (g(p.insu2i) + g(p.insu2)))
                    if(par2 > 0 && p.serv2 !== 0){
                      par2 = par2*balanco.servs[p.serv2][2]*0.2 
                    }
                    else{
                      par2 = 0
                    }
                    par1 = (g(p.volume1) - (g(p.insu1i) + g(p.insu1)))
                    console.log(par1)
                    if(par1 > 0 && p.serv1 !== 0){
                      par1 = par1*balanco.servs[p.serv1][2]*0.2 
                    }
                    else{
                      par1 = 0
                    }
                    console.log("par2: " +par2)
                    console.log("par1: " +par1)
                    hora_e = Math.round(par1+par2)
                  }
                  function check3(a) {
                    if(a){
                      return a[2]
                    }
                    else{
                      return 0
                    }
                  }
                  console.log('p.insu1i+p.insu2i '+p.insu1i+p.insu2i)
                  valores[ii].innerText = Math.round((p.volume1*p.preco1+p.volume2*p.preco2 - (estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)-d.custo_troca_insumos)-((p.promotores*2160+(p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2) + p.propagandai + p.prop1 + p.prop2+ 2880 + p.emprestimo*0.08+p.frota*10800+p.frota*2400+p.pesquisas+p.pas*2160)))
                }
              }
              if(i == 36 && ii == 1){
                if((d.receita - (d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem - b.estoque) - (d.despesas_administrativas + d.salario_promotores + d.comissao + d.propaganda_institucional + d.propaganda_unitaria + d.depreciacao_de_maquinas + d.encargos_financiamento + d.salario_frota + d.manutencao_frota + d.depreciacao_de_veiculos + d.despesas_operacionais_n_planejadas + d.pas + d.pesquisas)) > (d.receita - (d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem - d.capacidade_n_utilizada) - (d.despesas_administrativas + d.salario_promotores + d.comissao + d.propaganda_institucional + d.propaganda_unitaria + d.depreciacao_de_maquinas + d.encargos_financiamento + d.salario_frota + d.manutencao_frota + d.depreciacao_de_veiculos + d.despesas_operacionais_n_planejadas + d.pas + d.pesquisas))*0.05){
                  valores[ii].innerText = Math.round((d.receita - (d.estoque_inicial + d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem - b.estoque) - (d.despesas_administrativas + d.salario_promotores + d.comissao + d.propaganda_institucional + d.propaganda_unitaria + d.depreciacao_de_maquinas + d.encargos_financiamento + d.salario_frota + d.manutencao_frota + d.depreciacao_de_veiculos + d.despesas_operacionais_n_planejadas + d.pas + d.pesquisas))*0.05)
                }
                else{
                  valores[ii].innerText = 0
                }
                if(p!==0){
                  let estocagem = (g(p.insu1)+g(p.insu2)+g(p.insu1i)+g(p.insu2i)) - (g(p.volume2)+g(p.volume1))
                
                  function g(g) {
                  //console.log('g1: ' +g)
                  if(g > 0 ){
                    //console.log('g: ' +g)
                    return Number(g)
                  }
                  else{
                    return 0
                  }
                  }
                  let hora_e = 0
        
                  if(g(p.volume1) - (g(p.insu1)+g(p.insu1i)) > 0 || g(p.volume2) - (g(p.insu2)+g(p.insu2i) > 0)){
                    let par2 = 0
                    let par1 = 0
                    par2 = (g(p.volume2) - (g(p.insu2i) + g(p.insu2)))
                    if(par2 > 0 && p.serv2 !== 0){
                      par2 = par2*balanco.servs[p.serv2][2]*0.2 
                    }
                    else{
                      par2 = 0
                    }
                    par1 = (g(p.volume1) - (g(p.insu1i) + g(p.insu1)))
                    console.log(par1)
                    if(par1 > 0 && p.serv1 !== 0){
                      par1 = par1*balanco.servs[p.serv1][2]*0.2 
                    }
                    else{
                      par1 = 0
                    }
                    console.log("par2: " +par2)
                    console.log("par1: " +par1)
                    hora_e = Math.round(par1+par2)
                  }
                
                function check3(a) {
                  if(a){
                    return a[2]
                  }
                  else{
                    return 0
                  }
                }
                //let estocagem = 0
                if((p.insu1+p.insu2+p.insu1i+p.insu2i) - p.volume2+p.volume1 > 0){
                  estocagem = Math.round((p.insu1+p.insu2+p.insu1i+p.insu2i) - p.volume2+p.volume1)*30
                }
                
                if(p!==0 && (Math.round((p.volume1*p.preco1+p.volume2*p.preco2 - (estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)-d.custo_troca_insumos)-((p.promotores*2160+(p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2) + p.propagandai + p.prop1 + p.prop2+ 2880 + p.emprestimo*0.08+p.frota*10800+p.frota*2400+p.pesquisas+p.pas*2160)))) > 0){
                  
                  
                  console.log('p.insu1i+p.insu2i '+p.insu1i+p.insu2i)
                  valores[ii].innerText = Math.round(0.3*Math.round((p.volume1*p.preco1+p.volume2*p.preco2 - (estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)-d.custo_troca_insumos)-((p.promotores*2160+(p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2) + p.propagandai + p.prop1 + p.prop2+ 2880 + p.emprestimo*0.08+p.frota*10800+p.frota*2400+p.pesquisas+p.pas*2160))))
                }
              }
              }
              if(i == 37 && ii == 1){
                valores[ii].innerText = Math.round((d.receita - (d.estoque_inicial + d.custo_prestacao_servico + d.hora_extra + d.custo_troca_insumos + d.custo_estocagem - b.estoque) - (d.despesas_administrativas + d.salario_promotores + d.comissao + d.propaganda_institucional + d.propaganda_unitaria + d.depreciacao_de_maquinas + d.encargos_financiamento + d.salario_frota + d.manutencao_frota + d.depreciacao_de_veiculos + d.despesas_operacionais_n_planejadas + d.pas + d.pesquisas))*0.95)
                if(p!==0){
                  let estocagem = (g(p.insu1)+g(p.insu2)+g(p.insu1i)+g(p.insu2i)) - (g(p.volume2)+g(p.volume1))
                
                  function g(g) {
                  //console.log('g1: ' +g)
                  if(g > 0 ){
                    //console.log('g: ' +g)
                    return Number(g)
                  }
                  else{
                    return 0
                  }
                  }
                  let hora_e = 0
        
                  if(g(p.volume1) - (g(p.insu1)+g(p.insu1i)) > 0 || g(p.volume2) - (g(p.insu2)+g(p.insu2i) > 0)){
                    let par2 = 0
                    let par1 = 0
                    par2 = (g(p.volume2) - (g(p.insu2i) + g(p.insu2)))
                    if(par2 > 0 && p.serv2 !== 0){
                      par2 = par2*balanco.servs[p.serv2][2]*0.2 
                    }
                    else{
                      par2 = 0
                    }
                    par1 = (g(p.volume1) - (g(p.insu1i) + g(p.insu1)))
                    console.log(par1)
                    if(par1 > 0 && p.serv1 !== 0){
                      par1 = par1*balanco.servs[p.serv1][2]*0.2 
                    }
                    else{
                      par1 = 0
                    }
                    console.log("par2: " +par2)
                    console.log("par1: " +par1)
                    hora_e = Math.round(par1+par2)
                  }
                  function check3(a) {
                    if(a){
                      return a[2]
                    }
                    else{
                      return 0
                    }
                  }
                  console.log('p.insu1i+p.insu2i '+p.insu1i+p.insu2i)
                  if(0 < Math.round((p.volume1*p.preco1+p.volume2*p.preco2 - (estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)-d.custo_troca_insumos)-((p.promotores*2160+(p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2) + p.propagandai + p.prop1 + p.prop2+ 2880 + p.emprestimo*0.08+p.frota*10800+p.frota*2400+p.pesquisas+p.pas*2160)))){
                  valores[ii].innerText = Math.round(0.7*Math.round((p.volume1*p.preco1+p.volume2*p.preco2 - (estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)-d.custo_troca_insumos)-((p.promotores*2160+(p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2) + p.propagandai + p.prop1 + p.prop2+ 2880 + p.emprestimo*0.08+p.frota*10800+p.frota*2400+p.pesquisas+p.pas*2160))))
                }
                else{
                  valores[ii].innerText = Math.round((p.volume1*p.preco1+p.volume2*p.preco2 - (estocagem + hora_e + check3(balanco.servs[p.serv1])*p.volume1+check3(balanco.servs[p.serv2])*p.volume2)+d.custo_troca_insumos)-((p.promotores*2160+(p.comissao.slice(0,p.comissao.length-1))*0.01*(p.volume1*p.preco1+p.volume2*p.preco2) + p.propagandai + p.prop1 + p.prop2+ 2880 + p.emprestimo*0.08+p.frota*10800+p.frota*2400+p.pesquisas+p.pas*2160)))
                
                }
              }
              }
          }
        }
      }
      }
    });
    return () => {socket.off('balancos')}
  },[])

  const classes = useStyles();



  return (
    <TableContainer style={{ marginLeft: '0.8rem', marginTop: '1rem' }} component={Paper}>
      <Table className={classes.table} size="small" aria-label="spanning table" id="balancod">
        <TableHead>
          <TableRow style={{
          backgroundColor: '#3f51b5',
          height: 5
      }}>
            <TableCell style={{fontSize: 20, color: 'White'}} align="center" colSpan={3}>
              Demonstração de Resultado
            </TableCell>
            <TableCell align="right" style={{color: 'White'}}></TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">Tipos de serviço:</TableCell>
            <TableCell align="right">147</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>REEMBOLSO TOTAL</TableCell>
              <TableCell style={{fontWeight: "bold"}}>96708</TableCell>
              <TableCell align="right">$ Preço Médio</TableCell>
              <TableCell align="right">609</TableCell>
            </TableRow>

            
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Atendimentos</TableCell>
              <TableCell align="right">1876</TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>(-) Custo dos serviços prestados (CSP)</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Custo 147</TableCell>
              <TableCell align="right">288</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Custo 159</TableCell>
              <TableCell align="right">308</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CAPACIDADE INSTALADA INICIAL DE PRESTAÇÃO DE SERVIÇOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Estoque de Insumos inicial</TableCell>
              <TableCell align="right">988</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CUSTO DE PRESTAÇÃO DOS SERVIÇOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CUSTO DE ESTOCAGEM ($36/unit)</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Total não utilizado</TableCell>
              <TableCell align="right">403</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CUSTO DE ALTERAÇÃO DE TIPO DE SERVIÇO</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CUSTOS DE HORA EXTRA</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TOTAL EM DISPONIBILIDADE</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>(-) CAPACIDADE INSTALADA NÃO UTILIZADA</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow style={{
            backgroundColor: '#A8A8A8'
        }}>
              <TableCell style={{fontWeight: "bold"}}>(-) CSP</TableCell>
              <TableCell></TableCell>
              <TableCell align="right" style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>MARGEM BRUTA</TableCell>
              <TableCell></TableCell>
              <TableCell align="right" style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TOTAL DE SERVIÇOS PRESTADOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow style={{
            backgroundColor: '#A8A8A8'
        }}>
              <TableCell style={{fontWeight: "bold"}}>(-) DESPESAS OPERACIONAIS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>DESPESAS ADMINISTRATIVAS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>PROMOTORES</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"># Promotores</TableCell>
              <TableCell align="right">40</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SALÁRIOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">% Comissão</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>COMISSÕES</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">$ Salário Unitário</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>PROPAGANDA</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INSTITUCIONAL</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PRODUTOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>DEPRECIAÇÃO DE MÁQUINAS / EQUIPAMENTOS</TableCell>
              <TableCell style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right">Período depreciação máquinas (ANOS)</TableCell>
              <TableCell align="right">192000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>ENCARGOS SOBRE FINANCIAMENTOS</TableCell>
              <TableCell style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right">Taxa de Juros</TableCell>
              <TableCell align="right">8%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>TRANSPORTE</TableCell>
              <TableCell style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right"># Motoristas</TableCell>
              <TableCell align="right">10</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SALÁRIOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Salário Unitário</TableCell>
              <TableCell align="right">4800</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>LUBRIFICAÇÃO E MANUTENÇÃO</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Manutenção</TableCell>
              <TableCell align="right">600</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>DEPRECIAÇÃO DE VEÍCULOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Valor do Veículo</TableCell>
              <TableCell align="right">57600</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>FROTA DE TERCEIROS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Depreciação (ANOS)</TableCell>
              <TableCell align="right">4</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>DESPESAS NÃO PLANEJADOS</TableCell>
              <TableCell style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>POSTOS AVANÇADOS DE ATENDIMENTO</TableCell>
              <TableCell style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right"># Postos</TableCell>
              <TableCell align="right">30</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{fontWeight: "bold"}}>PESQUISA DE MERCADO</TableCell>
              <TableCell style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right">Custo Unitário</TableCell>
              <TableCell align="right">2160</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">Custo Fixo</TableCell>
              <TableCell align="right">50400</TableCell>
            </TableRow>
            <TableRow style={{
            backgroundColor: '#A8A8A8'
        }}>
              <TableCell style={{fontWeight: "bold"}}>TOTAL DESPESAS OPERACIONAIS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right" style={{fontWeight: "bold"}}></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>RESULTADO ANTES DE CONSIDERAR TRIBUTOS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TRIBUTOS E TAXAS TOTAIS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>RESULTADO DA OPERAÇÃO</TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Dre;