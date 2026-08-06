import { useState } from "react";


export default function App(){

const [role,setRole] = useState<string | null>(null);


return (

<div className="page">

<h1>
KPMS
</h1>

<p>
Magic RPG Virtual Tabletop
</p>


{
!role &&

<div>

<button
onClick={()=>setRole("player")}
>
Войти как игрок
</button>


<button
onClick={()=>setRole("master")}
>
Войти как мастер
</button>

</div>

}



{
role==="player" &&

<div className="panel">

<h2>
Кабинет игрока
</h2>

<p>
🧙 Персонаж
</p>

<p>
🪄 Заклинания
</p>

<p>
🧪 Зелья
</p>

<p>
🎲 Куб
</p>

<p>
🗺 Карта
</p>

</div>

}



{
role==="master" &&

<div className="panel">

<h2>
Рабочий стол мастера
</h2>

<p>
🤖 Генерация сценария
</p>

<p>
🧙 Игроки
</p>

<p>
🗺 Управление картой
</p>

<p>
🎲 Кубы
</p>

</div>

}


</div>


)

}
