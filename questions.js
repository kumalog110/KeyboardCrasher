const questions = [
  "ドライブにデザイン入れました。確認をお願いします。",
  "こちらのスケジュールでよいですか？",
  "ハドルできますか？急ぎ相談したいです。",
  "新しいバナーのデザインを作成しました。",
  "チケットを作成したので、ご確認ください。",
  "今、少し時間ありますか？",
  "Googleドライブのリンクを共有してください。",
  "Notionにプロジェクトを追加しました。",
  "Slackで連絡した件について、確認お願いします。",
  "Zoomミーティングのリンクをください。",
  "Illustratorで調整お願いします。",
  "Photoshopで調整お願いします。",
  "バグ修正についてVS Codeで確認します。",
  "今日の会議は何時から開始ですか？",
  "新しい案件の概要を共有しておきますね。",
  "デザインに関するご意見をいただけますか？",
  "作業状況の進捗をSlackで共有しました。",
  "ドライブに保存したaiファイルを確認してください。",
  "フォントサイズの調整をお願いします。",
  "ChatGPTで生成したアイデアを元に進めます。",
  "Figmaのアートボードを新しく作成しました。",
  "miroのボードを更新しましたのでご確認ください。",
  "チーム全員にメンションを送りますね。",
  "Figmaの共有リンクが開けないようです。",
  "今、ハドルしてもよいですか？",
  "・残作業: トップページのデザイン作成",
  "・残作業: MVのサムネ差し替え",
  "Notionのデータベースを整理しました。",
  "来週のスケジュールをGoogleカレンダーに入力しました。",
  "確認後に修正内容をリストアップしてください。",
  "font-size: 1.6rem; line-height: 1.5;",
  "display: flex; align-items: center;",
  "background-color: rgba(0, 0, 0, 0.8);",
  "@media (min-width: 1024px) { ... }",
  "margin: 0 auto; width: 80%;",
  "flex-wrap: wrap; justify-content: space-between;",
  "text-align: center; color: #333;",
  "transition: all 0.3s ease-in-out;",
  "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }",
  "max-height: 300px; overflow: hidden;",
  "ミニマリズムは、必要最低限の要素で美と機能を追求するデザイン哲学です。",
  "ピクセルアートは、インターネット黎明期の懐かしさを残しつつ進化したドット表現です。",
  "ユーティリタリアンデザインは、実用性を重視しつつ美しさを兼ね備えたスタイルです。",
  "蛍光色のデザインは、鮮烈な色彩で視覚的インパクトを与える手法です。",
  "手描きスタイルは、らくがき風の手描き感で親しみやすさを演出します。",
  "モダンナチュラルデザインは、自然の素材感とモダンなエッセンスを融合したスタイルです。",
  "3Dデザインは、進化した立体表現でリアリティと深みを持たせる技法です。",
  "ジェネラティブアートは、アルゴリズムを使いコンピューターが自動生成するアートです。",
  "モーションデザインは、動きによるストーリーテリングや感情表現を行う手法です。",
  "ブルータリズムは、粗野な素材感や無骨な美を強調したデザイン様式です。",
  "スキューモーフィズムは、物理的な質感や形状をデジタル空間に再現する技術です。",
  "セリフフォントは、伝統的な装飾が施された書体で、近年再評価されています。",
  "ステッカーデザインは、遊び心あるモチーフでカジュアルな印象を与える手法です。",
  "カスタムフォントは、特定のブランドやプロジェクト専用に作られるフォントです。",
  "レトロポップは、90年代のポップなデザインエッセンスを復刻したスタイルです。",
  "ニュートロポリタンデザインは、都会的で洗練されたシンプルなビジュアル表現です。",
  "スクロール操作の進化により、スクロールテリングが画面内での物語性を高めています。",
  "色彩トレンドが移り変わる中、グラデーションデザインが深みとダイナミックさを再び取り戻しています。",
  "2000年代初頭の未来志向が再評価され、Y2Kデザインが鮮やかな色彩で復活しています。",
  "サイバーパンクの流れが進む中、Y3Kデザインはさらに未来的な要素を含むビジュアルへと進化しています。",
  "モバイルユーザーの増加に伴い、BENTO UIのようなシンプルでコンパクトなUIが注目されています。",
  "映像技術の向上により、シネマティックスクロールは映画的演出をWeb体験に取り入れています。",
  "大胆な色彩や幾何学模様が再評価され、80sデザインがトレンドに回帰しています。",
  "インターネット黎明期の懐かしさを求める声が増え、ヴェイパーウェイヴがノスタルジックな美学として再登場しています。",
  "手作業の温かみを求める動きから、ハンドクラフトのようなデザインが再び注目を浴びています。",
  "ショート動画が普及する中、短い映像での表現に特化したショート動画デザインが主流となりつつあります。",
  "動きのある文字表現が増え、キネティックタイポグラフィが感情豊かなタイポグラフィとして脚光を浴びています。",
  "短時間で強い印象を与える必要性が高まり、ダイナミックメニューのような直感的なナビゲーションが支持されています。",
  "タッチやスワイプを活用したジェスチャーデザインは、操作性とデザイン性の両方を進化させています。",
  "シンプルさと洗練さを求める中で、単一色を基調としたモノクロームデザインが注目されています。"
  ];