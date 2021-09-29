$(function () {
  // アクセス時のロゴアニメーション関連
  $(".mv").hide().fadeIn("slow");

  var webStorage = function () {
    if (sessionStorage.getItem("access")) {
      // sessionStorage.removeItem("access");

      setTimeout(function () {
        $(".loading").fadeOut(0);
      }, 0); //2.5秒後にロゴ含め真っ白背景をフェードアウト
    } else {
      /*
        初回アクセス時の処理
      */
      sessionStorage.setItem("access", "true"); // sessionStorageにデータを保存

      setTimeout(function () {
        $(".loading p").fadeIn(500);
      }, 500); //0.5秒後にロゴをフェードイン!
      setTimeout(function () {
        $(".loading").fadeOut(500);
      }, 2500); //2.5秒後にロゴ含め真っ白背景をフェードアウト
    }
  };
  webStorage();

  // モーダル関連
  // モーダルを開く直前のスクロール量を取得するための変数
  var scrollPos;
  // お問い合わせフォームの送信時確認モーダル表示
  $(".js-modal-open-form").click(function () {
    // バリデーション
    if (!$("#contact-form")[0].reportValidity()) {
    } else {
      // スクロール量取得
      scrollPos = $(window).scrollTop();
      // 本ページ（背景）がスクロールしないようにする
      $("body").addClass("no_scroll").css({ top: -scrollPos });
      // モーダル表示
      var id = $(this).data("id");
      $("#overlay, .modal-window[data-id='modal-" + id + "']").fadeIn();
      if ($(this).attr("id") == "form_btn") {
        // お問い合わせフォームの内容をモーダル画面に反映
        var form_name = $("#form_name");
        var form_email = $("#form_email");
        var form_main = $("#form_main");
        var name = $("#name").val();
        var email = $("#email").val();
        var main = $("#main").val();
        form_name.html(name);
        form_email.html(email);
        form_main.html(main);
      }
    }
  });

  // その他のモーダルを開く処理
  $(".js-modal-open").click(function () {
    // スクロール量取得
    scrollPos = $(window).scrollTop();
    // 本ページ（背景）がスクロールしないようにする
    $("body").addClass("no_scroll").css({ top: -scrollPos });
    // モーダル表示
    var id = $(this).data("id");
    $("#overlay, .modal-window[data-id='modal-" + id + "']").fadeIn();
  });

  // モーダルを閉じる処理
  $(".js-modal-close, .js-modal-close-form, #overlay").click(function () {
    // 本ページをスクロール可能にする
    $("body").removeClass("no_scroll");
    // モーダルを開いた時に取得しておいたスクロール量分だけスクロール
    $(window).scrollTop(scrollPos);
    // モーダル、オーバーレイを非表示
    $("#overlay, .modal-window").fadeOut();
  });

  // ハンバーガーメニューに関して
  var $nav = $("#navArea");
  var $btn = $(".toggle_btn");
  var $mask = $("#mask");
  var open = "open"; // class
  var $nav_a = $(".header-list a");
  $nav_a.on("click", function () {
    $nav.removeClass(open);
  });
  // menu open close
  $btn.on("click", function () {
    if (!$nav.hasClass(open)) {
      $nav.addClass(open);
    } else {
      $nav.removeClass(open);
    }
  });
  // mask close
  $mask.on("click", function () {
    $nav.removeClass(open);
  });

  // お問い合わせフォームについて
  // 始めに送信ボタンを無効化する
  $(".send").removeClass("js-modal-open-form");
  $(".send").addClass("disabled");

  //入力欄の操作時
  $("form input:required, textarea:required").change(function () {
    //必須項目が空かどうかフラグ
    let flag = true;
    //必須項目をひとつずつチェック
    $("form input:required, textarea:required").each(function (e) {
      //もし必須項目が空なら
      if ($("form input:required, textarea:required").eq(e).val() === "") {
        flag = false;
      }
    });
    //全て埋まっていたら
    if (flag) {
      //送信ボタンを復活
      $(".send").removeClass("disabled");
      $(".send").addClass("js-modal-open-form");
    } else {
      //送信ボタンを閉じる
      $(".send").removeClass("js-modal-open-form");
      $(".send").addClass("disabled");
    }
  });

  // お問い合わせ内容、改行コードを修正する関数
  var convertNl = function (jsonString) {
    return jsonString
      .replace(/(\r\n)/g, "\n")
      .replace(/(\r)/g, "\n")
      .replace(/(\n)/g, "\\n");
  };

  // お問い合わせの送信ボタンクリック時
  $("#submit-btn").click(function () {
    // 変数定義
    var apiurl =
      "https://fhf1g5aadh.execute-api.ap-northeast-3.amazonaws.com/maildev/mail_send_lambda";
    // formタグの中身を取得
    var form = $("#contact-form");
    // formタグ内のvalue値を取得
    var formdata = JSON.stringify(form.serializeArray());
    // 日本語の文字化け対策
    var data = JSON.parse(formdata);

    Object.keys(data).forEach(function (key) {
      data[key].value = data[key].value.replace(/\r\n/g, "<br>");
    });

    var text =
      "name=" +
      data[0].value +
      "&email=" +
      data[1].value +
      "&main=" +
      data[2].value;

    // Ajax通信
    $.ajax({
      // Ajax定義
      type: "POST",
      url: apiurl,
      data: text,
      dataType: "json",
    })
      .done(function (data, textStatus, jqXHR) {
        alert("お問合せありがとうございました。");
        $("body").removeClass("no_scroll");
        $(window).scrollTop(scrollPos);
        $("#overlay, .modal-window").fadeOut();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // Ajaxの通信に問題があった場合
        alert("エラーが発生しました。");
        $("body").removeClass("no_scroll");
        $(window).scrollTop(scrollPos);
        $("#overlay, .modal-window").fadeOut();
      });
  });

  // トップに戻るボタン
  var pagetop = $("#page-top");
  pagetop.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      pagetop.fadeIn();
    } else {
      pagetop.fadeOut();
    }
  });
  pagetop.click(function () {
    $("body, html").animate({ scrollTop: 0 }, 500);
    return false;
  });
});
