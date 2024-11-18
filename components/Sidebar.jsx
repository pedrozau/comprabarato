import React from 'react';
import { Link } from 'react-router-dom';
import IconProdutos from '../icons/IconProdutos';
import IconPerfil from '../icons/IconPerfil';
import IconInformacoes from '../icons/IconInformacoes';

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <ul>
          <li>
            <Link to="/dashboard/produtos">
              <IconProdutos />
              <span>Produtos</span>
            </Link>
          </li>
          
          <li>
            <Link to="/dashboard/perfil">
              <IconPerfil />
              <span>Perfil</span>
            </Link>
          </li>
          
          <li>
            <Link to="/dashboard/informacoes">
              <IconInformacoes />
              <span>Informações da Loja</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar; 