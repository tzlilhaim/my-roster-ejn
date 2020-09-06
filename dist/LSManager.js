class NicknamesStorage {
  constructor() {
    this.nicknames = []
  }
  addNickname(data) {
    const n = new Nickname(data.firstName, data.lastName, data.nickname)
    this.nicknames.push(n)
  }
  updateNicknames() {
    let data = []
    for (let nickname of this.nicknames) {
      if (
        data.some(
          (n) => n.firstName === nickname.firstName && n.lastName === n.lastName
        )
      ) {
        continue
      } else {
        data.push(nickname)
      }
      this.nicknames = data
    }
  }
  getNicknameOfPlayer(firstName, lastName) {
    const result = nicknames.nicknames.filter(
      (n) =>
        n.firstName === firstName.toLowerCase() &&
        n.lastName === lastName.toLowerCase())
    return result.length ? result[0].nickname : false
  }
}

class Nickname {
  constructor(firstName, lastName, nickname) {
    this.firstName = firstName.toLowerCase()
    this.lastName = lastName.toLowerCase()
    this.nickname = nickname.toLowerCase()
  }
}

class LocalStorageManager {
  constructor() {
    this.isEmpty = localStorage.getItem("nicknames") === null ? true : false
  }
  loadAllNicknames() {
    const storedNicknames = localStorage.getItem("nicknames")
    const parsedData = JSON.parse(storedNicknames || "{}")
    if (parsedData.nicknames) {
      parsedData.nicknames.forEach((n) => nicknames.addNickname(n))
    }
    nicknames.updateNicknames()
  }
  clearLocalStorage() {
    localStorage.removeItem("nicknames")
  }
  checkForExistingNickname(firstName, lastName) {
      this.loadAllNicknames()
      const playerNickname = nicknames.getNicknameOfPlayer(firstName, lastName)
      return playerNickname
  }
  pushNicknamesToLS() {
    const data = JSON.stringify(nicknames)
    this.clearLocalStorage()
    if (data.length) {
      localStorage.setItem("nicknames", data)
    }
  }
  saveNewNickname(firstName, lastName, nickname) {
    nicknames.addNickname({
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
    })
    const all = this.loadAllNicknames()
    this.pushNicknamesToLS(all)
  }
  deleteNickname(firstName, lastName) {
    this.loadAllNicknames()
    const index = nicknames.nicknames.findIndex(
      (n) => n.firstName === firstName && n.lastName === lastName
    )
    nicknames.nicknames.splice(index, 1)
    this.pushNicknamesToLS()
  }
}

const nicknames = new NicknamesStorage()
