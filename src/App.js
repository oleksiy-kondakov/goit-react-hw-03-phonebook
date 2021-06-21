import { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Container from './components/Container';
import ContactForm from './components/ContactForm';
import Filter from './components/Filter';
import ContactList from './components/ContactList';

import './App.css';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');

    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const prevContacts = prevState.contacts;
    const nextContacts = this.state.contacts;

    if (prevContacts !== nextContacts) {
      localStorage.setItem('contacts', JSON.stringify(nextContacts));
    }
  }

  addContact = (name, number) => {
    const { contacts } = this.state;
    const newContact = { name, number, id: uuidv4() };
    const existedContactWithTheSameName = contacts.find(
      ({ name }) => name === newContact.name,
    );

    if (existedContactWithTheSameName !== undefined) {
      alert(`${newContact.name} is already in contacts`);
      return;
    }

    this.setState(({ contacts }) => ({
      contacts: [...contacts, newContact],
    }));
  };

  deleteContact = contactId => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(({ id }) => id !== contactId),
    }));
  };

  filterContactsByName = event => {
    const { name, value } = event.currentTarget;

    this.setState({ [name]: value });
  };

  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    const lowercasedFilter = filter.toLowerCase();

    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(lowercasedFilter),
    );
  };

  render() {
    const { filter } = this.state;
    const filteredContacts = this.getFilteredContacts();

    return (
      <Container>
        <h1 className="app-title">Phonebook</h1>

        <ContactForm onSubmit={this.addContact} />

        <h2 className="section-title">Contacts</h2>

        <Filter filter={filter} onChange={this.filterContactsByName} />

        <ContactList contacts={filteredContacts} onClick={this.deleteContact} />
      </Container>
    );
  }
}

export default App;
